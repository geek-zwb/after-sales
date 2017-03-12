<section class="mt20">
    <div class="row" style="margin:5px;">
        <div><a ui-sref="order.purchaseGroup.index">分组列表</a></div>
        <div class="col-sm-6 text-left">
            <div id="tags-table_filter" class="dataTables_filter search-box floatLeft">
                <label>搜索:<input type="search" class="form-control input-sm" ng-model="orderDepartment.filterValue" ng-change="orderDepartment.fnSearchChange()"></label>
            </div>
        </div>
        <div class="col-sm-6 text-right">
            <div class="btn-group pull-right">
                <button class="btn btn-default" ng-if="orderDepartment.isEditing" ng-click="orderDepartment.cancelChanges()">
                    <span class="glyphicon glyphicon-remove"></span>
                </button>
                <button class="btn btn-primary" ng-if="!orderDepartment.isEditing" ng-click="orderDepartment.isEditing = true">
                    <span class="glyphicon glyphicon-pencil"></span>
                </button>
                <button class="btn btn-primary" ng-if="orderDepartment.isEditing" ng-disabled="!orderDepartment.hasChanges() || orderDepartment.tableTracker.$invalid" ng-click="orderDepartment.saveChanges()">
                    <span class="glyphicon glyphicon-ok"></span>
                </button>
            </div>
        </div>
    </div>

    <div class="row">
        <div class="col-xs-12">
            <div class="box">
                <div class="box-body table-responsive">
                    <table  ng-table="orderDepartment.tableParams" class="table table-bordered table-hover table-condensed editable-table"
                            ng-form="orderDepartment.tableForm" disable-filter="orderDepartment.isAdding" nbg-tracked-table="orderDepartment.tableTracker">
                        <tr ng-repeat="row in $data" ng-form="rowForm" nbg-tracked-table-row="row">
                            <td data-title="'Id'" sortable="'id'" filter="{id: 'text'}">[: row.id :]</td>
                            <td title="'状态'" filter="{od_status_id: 'select'}" filter-data="orderDepartment.OrderDepartmentSer.arrOrderStatuses" ng-switch="orderDepartment.isEditing" ng-class="od_status_id.$dirty ? 'bg-warning' : ''" ng-form="od_status_id" nbg-tracked-table-cell>
                                <span ng-switch-default class="editable-text">[: row.od_status_id | zwbIdToName:orderDepartment.OrderDepartmentSer.orderStatuses :]</span>
                                <div class="controls" ng-class="od_status_id.$invalid && od_status_id.$dirty ? 'has-error' : ''" ng-switch-when="true">
                                    <select class="editable-input form-control input-sm" name="od_status_id" ng-model="row.od_status_id"
                                            ng-options="orderStatus.id as orderStatus.name for orderStatus in orderDepartment.OrderDepartmentSer.orderStatuses"></select>
                                </div>
                            </td>
                            <td title="'订单状态'" filter="{od_pay_after_status_id: 'select'}" filter-data="orderDepartment.OrderDepartmentSer.arrOrderPayAfterStatuses" ng-switch="orderDepartment.isEditing" ng-class="od_pay_after_status_id.$dirty ? 'bg-warning' : ''" ng-form="od_pay_after_status_id" nbg-tracked-table-cell>
                                <span ng-switch-default class="editable-text">[: row.od_pay_after_status_id | zwbIdToName:orderDepartment.OrderDepartmentSer.payAfterStatuses :]</span>
                                <div class="controls" ng-class="od_pay_after_status_id.$invalid && od_status_id.$dirty ? 'has-error' : ''" ng-switch-when="true">
                                    <select class="editable-input form-control input-sm" name="od_pay_after_status_id" ng-model="row.od_pay_after_status_id"
                                            ng-options="payAfterStatus.id as payAfterStatus.name for payAfterStatus in orderDepartment.OrderDepartmentSer.payAfterStatuses"></select>
                                </div>
                            </td>
                            <td data-title="'下单日期'" filter="{date_purchased: 'text'}">[: row.date_purchased :]</td>
                            <td title="'备注'" filter="{remark: 'text'}" ng-switch="orderDepartment.isEditing" ng-class="name.$dirty ? 'bg-warning' : ''" ng-form="remark" demo-tracked-table-cell>
                                <span ng-switch-default class="editable-text">[: row.remark :]</span>
                                <div class="controls" ng-class="remark.$invalid && remark.$dirty ? 'has-error' : ''" ng-switch-when="true">
                                    <input type="text" name="remark" ng-model="row.remark" class="editable-input form-control input-sm" required />
                                </div>
                            </td>
                            <td data-title="'订单号'" filter="{website_order_id: 'text'}">[: row.website_order_id :]</td>
                            <td data-title="'网站'" filter="{website_name: 'text'}">[: row.website_name :]</td>
                            <td data-title="'客户名字'" filter="{name: 'text'}">[: row.customer_name :]</td>
                            <td data-title="'金额'" filter="{order_total: 'text'}">[: row.order_total | currency:row.order_currency :]</td>
                            <td style="min-width: 350px;" data-title="'商品信息|采购分组|发货分组'">
                                <div class="row" ng-repeat="product in row.order_products">
                                    <div class="col-md-4"><span>[: product.quantity :] x </span><img class="order-small-image" ng-src="[: product.image_url :]" alt="[: product.product_name :]" title="[: product.product_name :]"></div>
                                    <div class="col-md-4">[: product.attributes_id :]</div>
                                    <div class="col-md-4 form-inline"><div class="checkbox"><label><input type="checkbox" ng-disabled="!orderDepartment.isCheckedAbled && product.purchase_group_id == 0" ng-checked="orderDepartment.isPurchaseGroupChecked(product)" ng-click="orderDepartment.addProductsToPurchaseGroup(product)">[: product.purchase_group_id | zwbIdToName:orderDepartment.purchaseGroups :]</label></div></div>
                                </div>
                            </td>
                        </tr>
                    </table>
                </div>
                <div class="box-body">
                    <div class="floatLeft">
                        <ul class="pagination-sm no-margin" previous-text="上一页" next-text="下一页" uib-pagination ng-change="orderDepartment.fnPageChanged()" items-per-page="orderDepartment.searchRemoteInfo.itemsPerPage" num-pages="orderDepartment.searchRemoteInfo.numPages" total-items="orderDepartment.searchRemoteInfo.totalItems" ng-model="orderDepartment.searchRemoteInfo.currentPage" max-size="orderDepartment.searchRemoteInfo.maxSize" boundary-link-numbers="true"></ul>
                    </div>
                    <div class="floatRight">
                        <div class="btn-group">
                            <label class="btn btn-default" ng-click="orderDepartment.fnSetItemsPerPage(10)" ng-model="itemsPerPage" uib-btn-radio="10">10</label>
                            <label class="btn btn-default" ng-click="orderDepartment.fnSetItemsPerPage(20)" ng-model="itemsPerPage" uib-btn-radio="20">20</label>
                            <label class="btn btn-default" ng-click="orderDepartment.fnSetItemsPerPage(50)" ng-model="itemsPerPage" uib-btn-radio="50">50</label>
                            <label class="btn btn-default" ng-click="orderDepartment.fnSetItemsPerPage(100)" ng-model="itemsPerPage" uib-btn-radio="100">100</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="group-box">
        <h2>采购分组</h2>
        <div class="row">
            <div class="col-sm-8">
                <label class="sr-only" for="purchaseGroup">采购分组</label>
                <input type="text" class="form-control" id="purchaseGroup" ng-model="orderDepartment.currentPurchaseGroup.name">
            </div>
            <div class="col-sm-4">
                <button class="btn btn-default btn-info" ng-click="orderDepartment.fnAddPurchaseGroup()"><i class="fa fa-plus-circle"></i>add</button>
            </div>
        </div>
        <div class="row">
            <div class="col-sm-8">
                <label class="sr-only" for="selectPurchaseGroup">采购分组</label>
                <select name="purchaseGroupSelect" class="form-control" ng-model="orderDepartment.purchaseGroupSelect" ng-options="purchaseGroup.name for purchaseGroup in orderDepartment.purchaseGroups"></select>
            </div>
            <div class="col-sm-4">
                <button class="btn btn-default btn-success" ng-click="orderDepartment.fnSelectPurchaseGroup()">select</button>
            </div>
        </div>
    </div>
</section>