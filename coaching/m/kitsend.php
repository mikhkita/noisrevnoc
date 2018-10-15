<?php
	require_once("phpmail.php");
	require_once("prices.php");
	require_once("amo.php");

	// $email_admin = "mike@kitaev.pro";
	$email_admin = "tverdohleb@transfiguration.agency";

	$from = "“Взлом конверсии 2.0” (для маркетологов)";
	$email_from = "robot@t-f-a.ru";

	$deafult = array("name"=>"Имя","phone"=>"Телефон", "email"=>"E-mail");

	$fields = array();

	if( count($_POST) ){

		foreach ($deafult  as $key => $value){
			if( isset($_POST[$key]) ){
				$fields[$value] = $_POST[$key];
			}
		}

		$i = 1;
		while( isset($_POST[''.$i]) ){
			$fields[$_POST[$i."-name"]] = $_POST[''.$i];
			$i++;
		}

		$subject = $_POST["subject"];

		$title = "Поступила заявка с сайта ".$from.":\n";

		$message = "<div><h3 style=\"color: #333;\">".$title."</h3>";

		foreach ($fields  as $key => $value){
			$message .= "<div><p><b>".$key.": </b>".$value."</p></div>";
		}

		if( isset($_POST["tovar_id"]) && $arPrice = $prices[$_POST["tovar_id"]] ){
			$message .= "<div><p><b>Курс: </b>".$arPrice["NAME"]."</p></div>";
			$message .= "<div><p><b>Стоимость курса: </b>".$arPrice["VIEW_PRICE"]."</p></div>";
		}
			
		$message .= "</div>";
		
		if(send_mime_mail("Сайт ".$from,$email_from,$name,$email_admin,'UTF-8','UTF-8',$subject,$message,true)){	
			if( !isset($_POST["tovar_id"]) )
				echo "1";
		}
	}

	$user = (object)array(
		"id" => 20568376,
		"login" => "tverdohleb@transfiguration.agency",
		"hash" => "2d4666f781f0fd665646d1e7da92b06f6b302f6c",
	);

	$params = array( 
		"user_id" => $user->id,
		"login" => $user->login, 
		"hash" => $user->hash,
		"subdomain" => "tfa",
		"phone_id" => 52307,
		"email_id" => 52309,
		"status_id" => 20568913,
		"course_id" => 422467,
		"type_id" => 422469,
	);


	if( AmoAuth($params) ){
		$leadId = AmoLead($params, $user->id);

		$courseId = false;
		if( isset($_POST["tovar_id"]) && $arPrice = $prices[$_POST["tovar_id"]] ){
			$courseId = $arPrice["COURSE_ID"];
		}
		$contactId = AmoContacts($params, $leadId, $user->id, $courseId, 822967);	 // 822969
	}

	if( isset($_POST["tovar_id"]) && $arPrice = $prices[$_POST["tovar_id"]] ):
?>

<div style="display: none;">
	<form id=pay name=pay method="POST" action="https://paymaster.ru/Payment/Init">
	<p>
		<input type="hidden" name="LMI_MERCHANT_ID" value="d6f97ab3-f9fe-4a22-8d1d-6c345e4639bd">
		<input type="hidden" name="LMI_PAYMENT_AMOUNT" value="<?=$arPrice["PRICE"]?>">
		<input type="hidden" name="LMI_CURRENCY" value="RUB">
		<input type="hidden" name="LMI_PAYMENT_DESC" value="Взлом конверсии 2.0">
		<input type="hidden" name="LMI_PAYMENT_METHOD" value="bankcard">
		<input type="hidden" name="LMI_PAYER_PHONE_NUMBER" value="<?=preg_replace("/[^0-9]/", '', $_POST["phone"])?>">
		<input type="hidden" name="LMI_PAYER_EMAIL" value="<?=$_POST["email"]?>">
		<input type="hidden" name="LMI_SHOPPINGCART.ITEMS[0].NAME" value="<?=$arPrice["NAME"]?>">
		<input type="hidden" name="LMI_SHOPPINGCART.ITEMS[0].QTY" value="1">
		<input type="hidden" name="LMI_SHOPPINGCART.ITEMS[0].PRICE" value="<?=$arPrice["PRICE"]?>">
		<input type="hidden" name="LMI_SHOPPINGCART.ITEMS[0].TAX" value="no_vat">
	</p>
	<p> <input type="submit" id="submit" value="Забронировать скидку сейчас"> </p>
	</form>
</div>
<script>
	document.getElementById("submit").click();
</script>
<? endif; ?>