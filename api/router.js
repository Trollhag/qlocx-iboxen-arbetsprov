const Router = require('@koa/router');
const PackageRouter = require('./routers/package');
const TransporterRouter = require('./routers/transporter');

const router = new Router({ prefix: `/api` });

router.use(PackageRouter.routes())
router.use(TransporterRouter.routes())

module.exports = router