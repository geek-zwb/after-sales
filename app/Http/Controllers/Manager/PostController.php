<?php

namespace App\Http\Controllers\Manager;

use App\Models\Manager\Post;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class PostController extends Controller
{
    protected $fields = [
        'title' => '',
        'abstract' => '',
        'description' => '',
        'visible' => '',
    ];

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $limit = $request->get('limit')?: 15;
        $page = $request->get('page')?: 1;
        $skip = ($page - 1)*$limit;

        $data['recordsTotal'] =  Post::count();
        $data['data'] = Post::limit($limit)
            ->skip($skip)
            ->orderBy('created_at', 'desc')
            ->get();

        return ['status' => 1, 'data' => $data];
    }

    public function allPost()
    {
        $data['recordsTotal'] =  Post::count();
        $data['data'] = Post::orderBy('created_at', 'desc')->get();
        return ['status' => 1, 'data' => $data];
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $post = new Post();

        foreach (array_keys($this->fields) as $field) {
            $post->$field = $request->get($field);
        }

        $post->user_id = Auth::user()->id;

        if(!$post->save()) {
            return ['status' => 0, 'msg' => '添加失败'];
        }

        return ['status' => 1, 'msg' => '添加成功'];
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $post = Post::find((int)$id);

        foreach (array_keys($this->fields) as $field) {
            $post->$field = $request->get($field);
        }

        if(!$post->save()) {
            return ['status' => 0, 'msg' => '修改失败'];
        }

        return ['status' => 1, 'msg' => '修改成功'];
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $post = Post::find((int)$id);

        if(!$post->delete()) {
            return ['status' => 0, 'msg' => '删除失败'];
        }

        return ['status' => 1, 'msg' => '删除成功'];
    }

    /**
     * live search
     */
    public function search(Request $request)
    {
        return Post::where('title', 'like', '%' . $request->keyword . '%')
            ->orWhere('description', 'like', '%' . $request->keyword . '%')
            ->orderBy('posts.created_at', 'desc')
            ->with('PostImages')->paginate(50);
    }
}
