<?php
/***********
 * Locates db.class.php file in parent directory
 ***********/
$current=dirname(__FILE__);
if(strpos($current,"public_html")) {
	$last=strpos($current,"public_html");	
} else if (strpos($current,"htdocs")) {
	$last=strpos($current,"htdocs");
} else if (strpos($current,"httpdocs")) {
	$last=strpos($current,"httpdocs");
} else if (strpos($current,"inetpub")) {
	$last=strpos($current,"inetpub");
} else {
	echo "Could not run application";
	die();
}
$configs=substr($current,0,$last)."db.class.php";
require_once($configs);
?>