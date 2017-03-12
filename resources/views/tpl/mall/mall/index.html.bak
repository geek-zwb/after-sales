<section class="mt20">
    <div class="row" style="margin:5px;">
        <div class="col-sm-6 text-left">
            <div id="tags-table_filter" class="dataTables_filter search-box">
                <label>搜索:<input type="search" class="form-control input-sm" ng-model="mall.filterValue" ng-change="mall.fnSearchChange()"></label>
            </div>
        </div>
        <div class="col-sm-6 text-right">
            <a ui-sref="mall.mall.add" class="btn btn-success btn-md">
                <i class="fa fa-plus-circle"></i> 新增
            </a>
        </div>
    </div>

    <div class="row">
        <div class="col-xs-12">
            <div class="box">
                <div class="box-body table-responsive">
                    <table  ng-table="mall.tableParams" class="table table-condensed table-bordered table-striped">
                        <tr ng-repeat="row in $data">
                            <td data-title="'Id'" sortable="'id'">[: row.id :]</td>
                            <td data-title="'店铺名称'" sortable="'name'">[: row.name :]</td>
                            <td data-title="'网址'" sortable="'website'">[: row.website :]</td>
                            <td data-title="'用户名'" sortable="'username'">[: row.username :]</td>
                            <td data-title="'密码'" sortable="'password'">[: row.password :]</td>
                            <td data-title="'店铺状态'" sortable="'mall_status_id'">[: row.mall_status_id :]</td>
                            <td data-title="'负责人'" sortable="'user_id'">[: row.user_id :]</td>
                            <td data-title="'备注'" sortable="'remark'">[: row.remark :]</td>
                            <td data-title="'操作'">
                                <div class="operationbox">
                                    <a style="margin:3px;" ui-sref="mall.mall.edit({mallId:row.id})" class="X-Small btn-xs text-success ">
                                        <i class="fa fa-edit"></i> 编辑
                                    </a>
                                    <a style="margin:3px;" ng-click="mall.fnDestoryPost(row.id)" class="delBtn X-Small btn-xs text-danger ">
                                        <i class="fa fa-times-circle-o"></i> 删除</a>
                                </div>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <div class="row">
        <div ng-show="mall.deleteAction.pending" class="col-sm-offset-2 col-sm-6 alert alert-success alert-dismissible" role="alert">
            <button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
            <strong>正在删除!</strong>
        </div>
        <div ng-if="mall.deleteAction.status" class="col-sm-offset-2 col-sm-6 alert alert-success alert-dismissible" role="alert">
            <button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
            <strong>删除成功!</strong>
        </div>
    </div>

</section>