<?php
/**
 * Created by PhpStorm.
 * User: geekzwb
 * Date: 2017/2/25
 * Time: 11:24
 */

$dir = __DIR__;
$viewsPath = dirname($dir).'/resources/views/tpl/';

function renameFile($viewsPath)
{
	if (is_dir($viewsPath)) {

		if($dh = opendir($viewsPath)) {
			while(false !== ($file = readdir($dh))) {
				if ($file != '.' && $file != '..') {
					if (is_file($viewsPath . $file)) {
						$newName = str_replace('.blade.php', '.html',$file);
						//echo "$file to $newName <br/>";
						rename($viewsPath . $file, $viewsPath . $newName);
					} else {
						//echo $viewsPath . $file . '/<br/>';
						renameFile($viewsPath.$file.'/');
					}
				}
			}

			closedir($dh);
		}
	}
}

renameFile($viewsPath);