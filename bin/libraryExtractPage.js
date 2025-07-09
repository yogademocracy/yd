const options = require('./options');
var path = require('path');
var fileUtil = require('./utils/fileUtil');
var xmlHelper = require('./utils/xmlHelper');

var sharedLibsPath = options.path + 'libraries';
var sitesPath = options.path + 'sites';

/**
 * Extract individual Page or Content with all linked content assets from Library to separate file:
 *
 * 1. Export Library from BM, rename to "expLibrary.xml" and copy to site's lib folder (near library.xml)
 * 2. Use one of the following commands in console (depending on lib type private\shared)
 *
 * npm run library:page -- --<siteid|lib>=<site-id|libraryid> --page=<page-id>
 *
 * Samples For Shared library:
 * npm run library:page -- --lib=becker-shared-library --page="homepage"
 * npm run library:page -- --lib=becker-shared-library --page="homepage" --remove
 * npm run library:page -- --lib=becker-shared-library --content=07939eee95931ed1f5c1c110c9
 * npm run library:page -- --lib=becker-shared-library --folder="blog"
 * todo: npm run library:page -- --lib=becker-shared-library --all --remove
 *
 * Sample For Private library:
 * npm run library:page -- --siteid=becker --page="homepage"
 * npm run library:page -- --siteid=becker --content=07939eee95931ed1f5c1c110c9
*/

if ((options.lib || options.siteid) && (options.page || options.all || options.content || options.folder)) {
    exportPage();
}

/**
 * get AllPage Folders
 * @param {Object} taskOptions - taskOptions
 * @param {Array} folderLinksArray - folderLinksArray
*/
async function getAllPageFolders(taskOptions, folderLinksArray) {
    var allPageFolders = [];
    var file = await fileUtil.readFile(`${taskOptions.libraryFolderPath}/libraryAssets.xml`);
    var xmlObj = await xmlHelper.parseFile(file);
    var libraryFolders = xmlObj.library.folder;

    libraryFolders.forEach((folderObj) => {
        var folderID = folderObj.$['folder-id'];

        if (folderLinksArray.indexOf(folderID) > -1) {
            allPageFolders.push(folderID);
            if (folderObj.parent) {
                allPageFolders = allPageFolders.concat(folderObj.parent);
            }
        }
    });

    return allPageFolders;
}

/**
 * exportPage
*/
async function exportPage() {
    var taskOptions =  {};
    var isContentCopy = !!options.content;

    if (options.lib) {
        taskOptions.libraryFolderPath = path.join(__dirname, sharedLibsPath, options.lib);
    }

    if (options.siteid) {
        // For Private Library
        taskOptions.libraryFolderPath = path.join(__dirname, sitesPath, options.siteid, 'library');
    }

    taskOptions.sourceLibraryFileName = 'expLibrary';

    if (options.remove) {
        taskOptions.sourceLibraryFileName = 'library';
    }

    taskOptions.sourceFilePath = `${taskOptions.libraryFolderPath}/${taskOptions.sourceLibraryFileName}.xml`;
    console.log(taskOptions.sourceFilePath);

    var file = await fileUtil.readFile(taskOptions.sourceFilePath);
    var xmlObj = await xmlHelper.parseFile(file);
    var xmlObjCopy = JSON.parse(JSON.stringify(xmlObj));
    var libraryHead = xmlHelper.getLibraryHead(xmlObjCopy);

    libraryHead.library.content = [];
    if (!xmlObj.library.content || xmlObj.library.content.length === 0) {
        return;
    }

    for await (let [pageAssetIndex, asset] of xmlObj.library.content.entries()) {
        var assetID = asset.$['content-id'];
        var assetFolderLinks = asset['folder-links'];
        var isMatched = false;

        if (options.page) {
            isMatched = assetID === options.page;
        }

        if (options.folder && assetFolderLinks) {
            var folderLinksArray = [];
            var folderAllLinksArray = [];

            assetFolderLinks.forEach((folderLink) => {
                folderLinksArray.push(folderLink['classification-link'][0].$['folder-id']);
            });
            var folderAllLinksArray = await getAllPageFolders(taskOptions, folderLinksArray);

            isMatched = folderAllLinksArray.indexOf(options.folder) > -1;
        }
        if (options.all && asset.type && asset.type[0]) {
            var assetTypePrefix = asset.type[0].substring(0, 4);

            isMatched = assetTypePrefix === 'page';
        }
        if (isContentCopy) {
            isMatched = assetID === options.content;
        }
        if (isMatched) {
            var xmlHead = JSON.parse(JSON.stringify(libraryHead));

            taskOptions.outputPageFilePath = `${taskOptions.libraryFolderPath}/pages/${assetID}.xml`;
            taskOptions.mainAssetID = assetID;
            taskOptions.removeIndexes = [];

            if (options.remove) {
                taskOptions.removeIndexes.push(pageAssetIndex);
            }

            copyPage(taskOptions, asset, xmlObjCopy, xmlHead, true);
        }
    };
}

/**
 * copyPage
 * @param {Object} taskOptions - taskOptions
 * @param {Object} asset - asset
 * @param {Object} xmlObj - xmlObj
 * @param {string} libraryHead - libraryHead
 * @param {boolean} isFirstLevel - isFirstLevel
*/
function copyPage(taskOptions, asset, xmlObj, libraryHead, isFirstLevel) {
    libraryHead.library.content.push(asset);

    findChildAsset(taskOptions, asset, xmlObj, libraryHead, isFirstLevel);
}

/**
 * findChildAsset
 * @param {Object} taskOptions - taskOptions
 * @param {Object} asset - asset
 * @param {Object} xmlObj - xmlObj
 * @param {Object} outputXmlObj - outputXmlObj
 * @param {boolean} isFirstLevel - isFirstLevel
*/
function findChildAsset(taskOptions, asset, xmlObj, outputXmlObj, isFirstLevel) {
    if (!asset) {
        return;
    }

    var contentLinksObj = asset['content-links'];
    var contentLinks = contentLinksObj ? contentLinksObj[0]['content-link'] : null;
    var xmlContentList = xmlObj.library.content;

    if (contentLinks && contentLinks.length > 0) {
        contentLinks.sort(function (a, b) {
            return Number(a.position[0]) - Number(b.position[0]);
        });

        contentLinks.forEach(contentLink => {
            var contentLinkID = contentLink.$['content-id'];

            xmlContentList.forEach((linkAsset, linkAssetIndex) => {
                if (linkAsset.$['content-id'] === contentLinkID) {
                    if (options.remove) {
                        taskOptions.removeIndexes.push(linkAssetIndex);
                    }
                    copyPage(taskOptions, linkAsset, xmlObj, outputXmlObj, false);
                }
            });
        });
    }

    if (isFirstLevel) {
        if (options.remove) {
            taskOptions.removeIndexes.reverse();

            taskOptions.removeIndexes.forEach(removeIndex => {
                xmlContentList.splice(removeIndex, 1);
            });

            xmlHelper.writeFile(xmlObj, taskOptions.sourceFilePath);
        }

        xmlHelper.writeFile(outputXmlObj, taskOptions.outputPageFilePath);
    }
}
