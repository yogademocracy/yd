var server = require('server');
server.extend(module.superModule);

server.append('PlaceOrder', function (req, res, next) {
    var OrderMgr = require('dw/order/OrderMgr');
    var Transaction = require('dw/system/Transaction');
    var URLUtils = require('dw/web/URLUtils');

    if (!session.privacy.AuthorizeErrors) {
        Transaction.wrap(function () {
            var orderID = res.getViewData().orderID;
            var order = OrderMgr.getOrder(orderID);

            order.paymentStatus = 2;
        });

        res.json({
            error: false,
            ID: session.privacy.orderID,
            token: session.privacy.orderToken,
            continueUrl: URLUtils.url('COPlaceOrder-SubmitOrderConformation').toString()
        });
    }

    return next();
});

module.exports = server.exports();
