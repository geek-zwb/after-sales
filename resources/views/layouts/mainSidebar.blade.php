<aside class="main-sidebar">

    <!-- sidebar: style can be found in sidebar.less -->
    <section class="sidebar">

        <!-- Sidebar user panel (optional) -->
      {{--  <div class="user-panel">
            <div class="pull-left image">
                <img src="/imgs/avatar/u1.jpg" class="img-circle" alt="User Image">
            </div>
            <div class="pull-left info">
                <p>{{auth()->user()->username}}</p>
                <!-- Status -->
                <a><i class="fa fa-circle text-success"></i> 在线</a>
            </div>
        </div>
--}}
        <!-- search form (Optional) -->
      {{--  <form action="#" method="get" class="sidebar-form">
            <div class="input-group">
                <input type="text" name="q" class="form-control" placeholder="搜索...">
              <span class="input-group-btn">
                <button type="submit" name="search" id="search-btn" class="btn btn-flat"><i class="fa fa-search"></i>
                </button>
              </span>
            </div>
        </form>--}}
        <!-- /.search form -->

        <!-- Sidebar Menu -->
        <ul class="sidebar-menu">
            {{--<li class="header"><i class="fa fa-times-circle-o"></i>2016-12-21</li>--}}
            <!-- Optionally, you can add icons to the links -->

            {{--<li><a href="/"><i class="fa fa-dashboard"></i> <span>控制面板</span></a></li>--}}

            <li class="treeview">
                <a><i class="fa fa-group"></i> <span>用户管理</span> <i
                            class="fa fa-angle-left pull-right"></i></a>
                <ul class="treeview-menu">
                    <li ng-class="{active: $state.includes('user')}">
                        <a ui-sref="user.info">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i class="fa fa-user-circle"></i>个人信息</a>
                    </li>
                    <li ng-class="{active: $state.includes('manager')}">
                        <a ui-sref="manager.staff.index">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i class="fa fa-users"></i>员工管理</a>
                    </li>
                    <li ng-class="{active: $state.includes('post')}">
                        <a ui-sref="post.postIndex">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i class="fa fa-newspaper-o"></i>新闻公告</a>
                    </li>
                </ul>
            </li>
            <li class="treeview" ng-class="{active: $state.includes('info') || $state.includes('service')}">
                <a><i class="fa fa-reorder"></i><span>售后信息管理</span><i class="fa fa-angle-left pull-right"></i></a>
                <ul class="treeview-menu">
                    <li ng-class="{active: $state.includes('service')}">
                        <a ui-sref="service.index">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i class="fa fa-sitemap"></i>售后信息分类</a>
                    </li>
                    <li ng-class="{active: $state.includes('info')}">
                        <a ui-sref="info.index">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i class="fa fa-bell"></i>售后服务</a>
                    </li>
                    <li>
                        <a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i class="fa fa-suitcase"></i>产品安装</a>
                    </li>
                    <li>
                        <a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i class="fa fa-send-o"></i>产品维修</a>
                    </li>
                    <li>
                        <a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i class="fa fa-send-o"></i>产品退换</a>
                    </li>
                    <li>
                        <a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i class="fa fa-handshake-o"></i>产品回访</a>
                    </li>
                </ul>
            </li>
        </ul>
        <!-- /.sidebar-menu -->
    </section>
    <!-- /.sidebar -->
</aside>