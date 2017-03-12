<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name')->index();
            $table->string('email')->unique();
            $table->string('phone')->comment("手机");
            $table->string('password', 255);
            $table->string('domicile',255)->comment('户籍所在地');
            $table->string('graduated_school',100)->comment('毕业院校');
            $table->string('address',100)->comment('住宅地址');
            $table->char('sex')->comment("性别");
            $table->string('qq')->comment("qq");
            $table->tinyInteger('identity')->default(0)->comment('身份类型');
            $table->text('remark')->comment("备注");
            $table->rememberToken();
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
        Schema::drop('users');
    }
}
