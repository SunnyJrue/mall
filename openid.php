<?php 
    $code = $_GET['code'];
    $appid = 'wx022220779d0c9e96';
    $secret = '0270525690e6749a3f3e72b8068edea2';
    $api = 'https://api.weixin.qq.com/sns/jscode2session?appid={$appid}&secret={$secret}&js_code={$code}&grant_type=authorization_code';

    
 ?>