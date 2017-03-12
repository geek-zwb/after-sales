<section class="mt20">
    <div class="row" style="margin:5px;">
        <div class="col-sm-6 text-left">
            <div id="tags-table_filter" class="dataTables_filter search-box floatLeft">
                <label>搜索:<input type="search" class="form-control input-sm" ng-model="stock.filterValue" ng-change="stock.fnSearchChange()"></label>
            </div>
        </div>
        <div class="col-sm-6 text-right">
            <div class="btn-group pull-right">
                <button class="btn btn-default" ng-if="stock.isEditing" ng-click="stock.cancelChanges()">
                    <span class="glyphicon glyphicon-remove"></span>
                </button>
                <button class="btn btn-primary" ng-if="!stock.isEditing" ng-click="stock.isEditing = true">
                    <span class="glyphicon glyphicon-pencil"></span>
                </button>
                <button class="btn btn-primary" ng-if="stock.isEditing" ng-disabled="!stock.hasChanges() || stock.tableTracker.$invalid" ng-click="stock.saveChanges()">
                    <span class="glyphicon glyphicon-ok"></span>
                </button>
            </div>
        </div>
    </div>

    <div class="row">
        <div class="col-xs-12">
            <div class="box">
                <div class="box-body table-responsive">
                    <table  ng-table="stock.tableParams" class="table table-bordered table-hover table-condensed editable-table"
                            ng-form="stock.tableForm" disable-filter="stock.isAdding" nbg-tracked-table="stock.tableTracker">
                        <tr ng-repeat="row in $data" ng-form="rowForm" nbg-tracked-table-row="row">
                            <td data-title="'Id'" sortable="'id'" filter="{id: 'text'}">[: row.id :]</td>
                            <td data-title="'产品名称'" filter="{name: 'text'}">[: row.name :]</td>
                            <td data-title="'SKU'" filter="{model: 'text'}">[: row.model :]</td>
                            <td data-title="'样图'"><img zwb-magnifying-glass class="order-small-image" ng-src="[: row.image :]" alt="[: row.name :]" title="[: row.name :]" /></td>
                            <td data-title="'price'">[: row.price :]</td>
                            <td style="min-width: 350px;" data-title="'库存信息'" sortable="'store_count'" ng-switch="stock.isEditing" ng-class="stocks.$dirty ? 'bg-warning' : ''" ng-form="stocks" demo-tracked-table-cell>
                                <div ng-switch-default class="row" ng-repeat="siglestock in row.stocks">
                                    <div class="col-md-6">属性：[: siglestock.attributes :]</div>
                                    <div class="col-md-6">库存量：<span class="editable-text">[: siglestock.store_count :]</span></div>
                                </div>
                                <div class="controls" ng-class="stocks.$invalid && stocks.$dirty ? 'has-error' : ''" ng-switch-when="true">
                                    <div class="row" ng-repeat="siglestock in row.stocks">
                                        <div class="col-md-6">属性：[: siglestock.attributes :]</div>
                                        <div class="col-md-6">库存量：<input type="number" name="store_count" ng-model="siglestock.store_count" class="editable-input form-control input-sm" required /></div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </table>
                </div>
                <div class="box-body">
                    <div class="floatLeft">
                        <ul class="pagination-sm no-margin" previous-text="上一页" next-text="下一页" uib-pagination ng-change="stock.fnPageChanged()" items-per-page="stock.searchRemoteInfo.itemsPerPage" num-pages="stock.searchRemoteInfo.numPages" total-items="stock.searchRemoteInfo.totalItems" ng-model="stock.searchRemoteInfo.currentPage" max-size="stock.searchRemoteInfo.maxSize" boundary-link-numbers="true"></ul>
                    </div>
                    <div class="floatRight">
                        <div class="btn-group">
                            <label class="btn btn-default" ng-click="stock.fnSetItemsPerPage(10)" ng-model="itemsPerPage" uib-btn-radio="10">10</label>
                            <label class="btn btn-default" ng-click="stock.fnSetItemsPerPage(20)" ng-model="itemsPerPage" uib-btn-radio="20">20</label>
                            <label class="btn btn-default" ng-click="stock.fnSetItemsPerPage(50)" ng-model="itemsPerPage" uib-btn-radio="50">50</label>
                            <label class="btn btn-default" ng-click="stock.fnSetItemsPerPage(100)" ng-model="itemsPerPage" uib-btn-radio="100">100</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>