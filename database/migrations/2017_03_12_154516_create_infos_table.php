<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateInfosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('infos', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name', 30)->comment('信息名称')->index();
            $table->string('description')->comment('信息详情');
            $table->unsignedSmallInteger('service_id')->comment('服务类型');
            $table->string('remark')->comment('备注');
            $table->unsignedInteger('user_id')->comment('处理人id')->index();
            $table->unsignedInteger('customer_id')->comment('顾客id')->index();
            $table->timestamp('resolve_time')->default('0000-00-00 00:00:00')->comment('处理时间');
            $table->string('feedback')->comment('客户反馈信息，评价');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('infos');
    }
}
