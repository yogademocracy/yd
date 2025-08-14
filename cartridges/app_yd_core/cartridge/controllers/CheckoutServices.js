var server = require('server');
server.extend(module.superModule);

server.append('PlaceOrder', function (req, res, next) {
    var OrderMgr = require('dw/order/OrderMgr');
    var Transaction = require('dw/system/Transaction');
    var URLUtils = require('dw/web/URLUtils');
    var Site = require('dw/system/Site');

    var orderID = res.getViewData().orderID;
    var order = OrderMgr.getOrder(orderID);

    if (!empty(order) && Site.current.getCustomPreferenceValue('Cybersource_CardTransactionType').value.toLowerCase() === 'sale' && !session.privacy.AuthorizeErrors) {
        Transaction.wrap(function () {
            order.setPaymentStatus(order.PAYMENT_STATUS_PAID);
        });

        res.json({
            error: false,
            ID: res.getViewData().orderID,
            token: res.getViewData().token,
            continueUrl: URLUtils.url('COPlaceOrder-SubmitOrderConformation').toString()
        });
    }

    return next();
});

module.exports = server.exports();
