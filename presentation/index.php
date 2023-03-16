<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$disableCache = intval(@$_GET['disableCache']);
            
$rand = $disableCache ? '?t='.time() : '';
function isHidden($s){
    return $s[0]=='.';
}
global $dr;
 function ttt($t){ global $dr; return "$dr/$t"; }
function dirToArray($dir, $recursive = false, $onlyDirs = false, $ignoreHidden = true) { 
global $dr;
   $result = array();
   
   if (!is_dir($dir))
        return $result;
    
   $cdir = scandir($dir);
   
   if ($recursive) {
   foreach ($cdir as $key => $value) 
      if (!in_array($value,array(".",".."))) 
      if (!$ignoreHidden || !isHidden($value))
         if (is_dir($dir . DIRECTORY_SEPARATOR . $value)) {
            $subdir = dirToArray($dir . DIRECTORY_SEPARATOR . $value, $recursive, $onlyDirs);
             $dr = $value;
           
            if ($recursive == 2){
                $result = array_merge($result, array_map('ttt', $subdir) );
            }
            else {
                $result[$value] = $subdir;
            }
         } else if (!$onlyDirs) $result[] = $value;
    }
   else 
   if (!$onlyDirs) {
        foreach ($cdir as $key => $value) {
            if (!in_array($value,array(".",".."))) {
                if (!$ignoreHidden || !isHidden($value)){
                    $result[] = $value;
                }
            }
        }
   }
   else {
       foreach ($cdir as $key => $value) {
            if (!in_array($value,array(".",".."))) {
                if (!$ignoreHidden || !isHidden($value)){
                        if (is_dir($dir . DIRECTORY_SEPARATOR . $value)){
                            $result[] = $value;
                        }
                }
            }
        }
   }
   return $result; 
}  


function toJSArray($dir, $pm, $excludepm = false, $prefx = ''){
 echo "[";
 $zpt = ''; 
 foreach ($dir as $v) { 
    if (preg_match($pm,$v)) {
        if ($excludepm) { 
            $v = preg_replace( $pm, '', $v);
        }
        echo $zpt."'$prefx$v'"; $zpt = ','; 
    }
 } 
 echo "]";
};

function dirToJSArray($dir, $pm, $excludepm = false, $prefx = '', $resursive = false){
    toJSArray( dirToArray( $dir, $resursive ), $pm, $excludepm, $prefx );
    
};

?><html><head>
<meta http-equiv="content-type" content="text/html; charset=utf-8">
<script>
window.loadlists = {
    shaders: <?php dirToJSArray('./res/shaders', '/\\.[fv]/') ?>,
    config: <?php dirToJSArray('./res/data', '/\\[^t].json$/') ?>,
};
</script>
<script src='loader.js'></script>
<style>* {margin:0;padding:0;touch-action:none} body { overflow:hidden; }</style>
</head>
<body>
</body>
</html>
