<section class="mt20">
    <div class="row">
        <a class="btn btn-info" ng-click="deliveryDepartment.fnExportDHL()">导出DHL</a>
    </div>
    <div class="row" style="margin:5px;">
        <div class="col-sm-6 text-left">
            <div id="tags-table_filter" class="dataTables_filter search-box">
                <label>搜索:<input type="search" class="form-control input-sm" ng-model="deliveryDepartment.filterValue" ng-change="deliveryDepartment.fnSearchChange()"></label>
            </div>
        </div>
        <div class="col-sm-6 text-right">
            <div class="btn-group pull-right">
                <button class="btn btn-default" ng-if="deliveryDepartment.isEditing" ng-click="deliveryDepartment.cancelChanges()">
                    <span class="glyphicon glyphicon-remove"></span>
                </button>
                <button class="btn btn-primary" ng-if="!deliveryDepartment.isEditing" ng-click="deliveryDepartment.isEditing = true">
                    <span class="glyphicon glyphicon-pencil"></span>
                </button>
                <button class="btn btn-primary" ng-if="deliveryDepartment.isEditing" ng-disabled="!deliveryDepartment.hasChanges() || deliveryDepartment.tableTracker.$invalid" ng-click="deliveryDepartment.saveChanges()">
                    <span class="glyphicon glyphicon-ok"></span>
                </button>
            </div>
        </div>
    </div>

    <div class="row">
        <div class="col-xs-12">
            <div class="box">
                <div class="box-body table-responsive">
                    <table  ng-table="deliveryDepartment.tableParams" class="table table-bordered table-hover table-condensed editable-table"
                            ng-form="deliveryDepartment.tableForm" disable-filter="deliveryDepartment.isAdding" nbg-tracked-table="deliveryDepartment.tableTracker">
                        <tr ng-repeat="row in $data" ng-form="rowForm" nbg-tracked-table-row="row">
                            <td data-title="'Id'" sortable="'id'" filter="{id: 'text'}">[: row.id :]</td>
                            <td title="'状态'" filter="{od_status_id: 'select'}" filter-data="deliveryDepartment.DeliverySer.arrOrderStatuses" ng-switch="deliveryDepartment.isEditing" ng-class="od_status_id.$dirty ? 'bg-warning' : ''" ng-form="od_status_id" nbg-tracked-table-cell>
                                <span ng-switch-default class="editable-text">[: row.od_status_id | zwbIdToName:deliveryDepartment.DeliverySer.orderStatuses :]</span>
                                <div class="controls" ng-class="od_status_id.$invalid && od_status_id.$dirty ? 'has-error' : ''" ng-switch-when="true">
                                    <select class="editable-input form-control input-sm" name="od_status_id" ng-model="row.od_status_id"
                                            ng-options="orderStatus.id as orderStatus.name for orderStatus in deliveryDepartment.DeliverySer.orderStatuses"></select>
                                </div>
                            </td>
                            <td title="'订单状态'" filter="{od_pay_after_status_id: 'select'}" filter-data="deliveryDepartment.DeliverySer.arrOrderPayAfterStatuses" ng-switch="deliveryDepartment.isEditing" ng-class="od_pay_after_status_id.$dirty ? 'bg-warning' : ''" ng-form="od_pay_after_status_id" nbg-tracked-table-cell>
                                <span ng-switch-default class="editable-text">[: row.od_pay_after_status_id | zwbIdToName:deliveryDepartment.DeliverySer.payAfterStatuses :]</span>
                                <div class="controls" ng-class="od_pay_after_status_id.$invalid && od_pay_after_status_id.$dirty ? 'has-error' : ''" ng-switch-when="true">
                                    <select class="editable-input form-control input-sm" name="od_pay_after_status_id" ng-model="row.od_pay_after_status_id"
                                            ng-options="payAfterStatus.id as payAfterStatus.name for payAfterStatus in deliveryDepartment.DeliverySer.payAfterStatuses"></select>
                                </div>
                            </td>
                            <td data-title="'整单日期'" filter="{order_pay_after_date: 'text'}">[: row.order_pay_after_date :]</td>
                            <td data-title="'订单号'" filter="{website_order_id: 'text'}">[: row.website_order_id :]</td>
                            <td data-title="'客户名字'" filter="{name: 'text'}">[: row.name :]</td>
                            <td title="'备注'" filter="{remark: 'text'}" ng-switch="deliveryDepartment.isEditing" ng-class="name.$dirty ? 'bg-warning' : ''" ng-form="remark" demo-tracked-table-cell>
                                <span ng-switch-default class="editable-text">[: row.remark :]</span>
                                <div class="controls" ng-class="remark.$invalid && remark.$dirty ? 'has-error' : ''" ng-switch-when="true">
                                    <input type="text" name="remark" ng-model="row.remark" class="editable-input form-control input-sm" required />
                                </div>
                            </td>
                            <td style="min-width: 350px;"  filter="{brand_id: 'select'}" filter-data="deliveryDepartment.DeliverySer.arrBrands" data-title="'商品信息|发货分组(品牌查询)'">
                                <div class="row" ng-repeat="product in row.order_products">
                                    <div class="col-md-4"><span>[: product.quantity :] x </span><img zwb-magnifying-glass class="order-small-image" ng-src="[: product.image_url :]" alt="[: product.product_name :]" title="[: product.product_name :]" /></div>
                                    <div class="col-md-4">[: product.attributes_id :]</div>
                                    <div class="col-md-4 form-inline"><div class="checkbox"><label><input type="checkbox" ng-disabled="!deliveryDepartment.isCheckedAbled && product.shipping_group_id == 0" ng-checked="deliveryDepartment.isShippingGroupChecked(product)" ng-click="deliveryDepartment.addProductsToShippingGroup(product)">[: product.shipping_group_id | zwbIdToName:deliveryDepartment.shippingGroups :]</label></div></div>
                                </div>
                            </td>
                            <td title="'产品分类'" filter="{od_category_id: 'select'}" filter-data="deliveryDepartment.DeliverySer.arrOrderCategories" ng-switch="deliveryDepartment.isEditing" ng-class="od_category_id.$dirty ? 'bg-warning' : ''" ng-form="od_category_id" nbg-tracked-table-cell>
                                <span ng-switch-default class="editable-text">[: row.od_category_id | zwbIdToName:deliveryDepartment.DeliverySer.orderCategories :]</span>
                                <div class="controls" ng-class="od_category_id.$invalid && od_category_id.$dirty ? 'has-error' : ''" ng-switch-when="true">
                                    <select class="editable-input form-control input-sm" name="od_category_id" ng-model="row.od_category_id"
                                            ng-options="orderCategory.id as orderCategory.name for orderCategory in deliveryDepartment.DeliverySer.orderCategories"></select>
                                </div>
                            </td>
                            <td title="'货运方式'" filter="{express_id: 'select'}" filter-data="deliveryDepartment.DeliverySer.arrExpresses" ng-switch="deliveryDepartment.isEditing" ng-class="express_id.$dirty ? 'bg-warning' : ''" ng-form="express_id" nbg-tracked-table-cell>
                                <span ng-switch-default class="editable-text">[: row.express_id | zwbIdToName:deliveryDepartment.DeliverySer.expresses :]</span>
                                <div class="controls" ng-class="express_id.$invalid && express_id.$dirty ? 'has-error' : ''" ng-switch-when="true">
                                    <select class="editable-input form-control input-sm" name="express_id" ng-model="row.express_id"
                                            ng-options="express.id as express.name for express in deliveryDepartment.DeliverySer.expresses"></select>
                                </div>
                            </td>
                        </tr>
                    </table>
                </div>
                <div class="box-body">
                    <div class="floatLeft">
                        <ul class="pagination-sm no-margin" previous-text="上一页" next-text="下一页" uib-pagination ng-change="deliveryDepartment.fnPageChanged()" items-per-page="deliveryDepartment.searchRemoteInfo.itemsPerPage" num-pages="deliveryDepartment.searchRemoteInfo.numPages" total-items="deliveryDepartment.searchRemoteInfo.totalItems" ng-model="deliveryDepartment.searchRemoteInfo.currentPage" max-size="deliveryDepartment.searchRemoteInfo.maxSize" boundary-link-numbers="true"></ul>
                    </div>
                    <div class="floatRight">
                        <div class="btn-group">
                            <label class="btn btn-default" ng-click="deliveryDepartment.fnSetItemsPerPage(10)" ng-model="itemsPerPage" uib-btn-radio="10">10</label>
                            <label class="btn btn-default" ng-click="deliveryDepartment.fnSetItemsPerPage(20)" ng-model="itemsPerPage" uib-btn-radio="20">20</label>
                            <label class="btn btn-default" ng-click="deliveryDepartment.fnSetItemsPerPage(50)" ng-model="itemsPerPage" uib-btn-radio="50">50</label>
                            <label class="btn btn-default" ng-click="deliveryDepartment.fnSetItemsPerPage(100)" ng-model="itemsPerPage" uib-btn-radio="100">100</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="group-box">
        <h2>发货分组</h2>
        <div class="row">
            <div class="col-sm-8">
                <label class="sr-only" for="shippingGroup">发货分组</label>
                <input type="text" class="form-control" id="shippingGroup" ng-model="deliveryDepartment.currentShippingGroup.name">
            </div>
            <div class="col-sm-4">
                <button class="btn btn-default btn-info" ng-click="deliveryDepartment.fnAddShippingGroup()"><i class="fa fa-plus-circle"></i>add</button>
            </div>
        </div>
        <div class="row">
            <div class="col-sm-8">
                <label class="sr-only" for="selectShippingGroup">发货分组</label>
                <select name="shippingGroupSelect" class="form-control" ng-model="deliveryDepartment.shippingGroupSelect" ng-options="shippingGroup.name for shippingGroup in deliveryDepartment.shippingGroups"></select>
            </div>
            <div class="col-sm-4">
                <button class="btn btn-default btn-success" ng-click="deliveryDepartment.fnSelectShippingGroup()">select</button>
            </div>
        </div>
    </div>
</section>