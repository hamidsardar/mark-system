<?php
if(isset($_REQUEST['module']) && ($_REQUEST['module']=='get_module_list')) {
    echo file_get_contents('https://nodejs-neo4j-api.herokuapp.com/api/module');
}
if(isset($_REQUEST['module']) && ($_REQUEST['module']=='add_module')) {

}
?>