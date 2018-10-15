<?

function AmoAuth($params){
	$user=array(
		'USER_LOGIN'=>$params["login"], #Ваш логин (электронная почта)
		'USER_HASH'=>$params["hash"] #Хэш для доступа к API (смотрите в профиле пользователя)
	);
	 
	$subdomain=$params["subdomain"]; #Наш аккаунт - поддомен
	 
	#Формируем ссылку для запроса
	$link='https://'.$subdomain.'.amocrm.ru/private/api/auth.php?type=json';

	$request = AmoRequest($link,$user);

	$out = $request["out"];
	$code=(int)$request["code"];
	$errors=array(
		301=>'Moved permanently',
		400=>'Bad request',
		401=>'Unauthorized',
		403=>'Forbidden',
		404=>'Not found',
		500=>'Internal server error',
		502=>'Bad gateway',
		503=>'Service unavailable'
	);
	try
	{
		#Если код ответа не равен 200 или 204 - возвращаем сообщение об ошибке
		if($code!=200 && $code!=204)
			throw new Exception(isset($errors[$code]) ? $errors[$code] : 'Undescribed error',$code);
	}
	catch(Exception $E)
	{
		die('Ошибка1: '.$E->getMessage().PHP_EOL.'Код ошибки: '.$E->getCode());
	}
	 
	/**
	 * Данные получаем в формате JSON, поэтому, для получения читаемых данных,
	 * нам придётся перевести ответ в формат, понятный PHP
	 */
	$Response=json_decode($out,true);
	$Response=$Response['response'];
	if(isset($Response['auth']))
		return true;
	return false;
}

function AmoRequest($link,$data){
	$curl=curl_init(); #Сохраняем дескриптор сеанса cURL
	#Устанавливаем необходимые опции для сеанса cURL
	curl_setopt($curl,CURLOPT_RETURNTRANSFER,true);
	curl_setopt($curl,CURLOPT_USERAGENT,'amoCRM-API-client/1.0');
	curl_setopt($curl,CURLOPT_URL,$link);
	curl_setopt($curl,CURLOPT_CUSTOMREQUEST,'POST');
	curl_setopt($curl,CURLOPT_POSTFIELDS,json_encode($data));
	curl_setopt($curl,CURLOPT_HTTPHEADER,array('Content-Type: application/json'));
	curl_setopt($curl,CURLOPT_HEADER,false);
	curl_setopt($curl,CURLOPT_COOKIEFILE,dirname(__FILE__).'/cookie.txt'); #PHP>5.3.6 dirname(__FILE__) -> __DIR__
	curl_setopt($curl,CURLOPT_COOKIEJAR,dirname(__FILE__).'/cookie.txt'); #PHP>5.3.6 dirname(__FILE__) -> __DIR__
	curl_setopt($curl,CURLOPT_SSL_VERIFYPEER,0);
	curl_setopt($curl,CURLOPT_SSL_VERIFYHOST,0);
	 
	$out=curl_exec($curl); #Инициируем запрос к API и сохраняем ответ в переменную
	$code=curl_getinfo($curl,CURLINFO_HTTP_CODE); #Получим HTTP-код ответа сервера
	curl_close($curl); #Завершаем сеанс cURL
	return array("out"=>$out,"code"=>$code);
}

function AmoLead($params, $userId){

	$leads['request']['leads']['add']=array(
		array(
			'name'=>'Сделка с сайта',
			'date_create'=>time(), //optional
			'status_id'=>$params["status_id"],
			'responsible_user_id'=>$userId,
			'tags' => 'Расчет', #Теги
		)
	);

	$subdomain=$params["subdomain"]; #Наш аккаунт - поддомен
	#Формируем ссылку для запроса
	$link='https://'.$subdomain.'.amocrm.ru/private/api/v2/json/leads/set';

	$request = AmoRequest($link,$leads);

	$out = $request["out"];
	$code=(int)$request["code"];
	$errors=array(
		301=>'Moved permanently',
		400=>'Bad request',
		401=>'Unauthorized',
		403=>'Forbidden',
		404=>'Not found',
		500=>'Internal server error',
		502=>'Bad gateway',
		503=>'Service unavailable'
	);
	try
	{
		#Если код ответа не равен 200 или 204 - возвращаем сообщение об ошибке
		if($code!=200 && $code!=204)
			throw new Exception(isset($errors[$code]) ? $errors[$code] : 'Undescribed error',$code);
	}
	catch(Exception $E)
	{
		die('Ошибка2: '.$E->getMessage().PHP_EOL.'Код ошибки: '.$E->getCode());
	}
	 
	/**
	 * Данные получаем в формате JSON, поэтому, для получения читаемых данных,
	 * нам придётся перевести ответ в формат, понятный PHP
	 */
	$Response=json_decode($out,true);
	$Response=$Response['response']['leads']['add'];
	 
	$output='';
	foreach($Response as $v)
		if(is_array($v))
			$output.=$v['id'];
	return $output;
}

function AmoContacts($params,$leadId,$userId,$courseId,$typeId){
	$custom_fields = array();

	// if( isset($_SESSION["source"]) && $_SESSION["source"] != "" ){
	// 	array_push($custom_fields, array(
	// 		#Источник
	// 		'id'=>$params["source_id"], #Уникальный индентификатор заполняемого дополнительного поля
	// 		'values'=>array(
	// 			array(
	// 				'value'=>$_SESSION["source"],
	// 			),
	// 		)
	// 	));
	// }

	if( $courseId ){
		array_push($custom_fields, array(
			#Курс
			'id'=>$params["course_id"],
			'values'=>array(
				array(
					'value'=>$courseId,
				),
			)
		));
	}

	if( $typeId ){
		array_push($custom_fields, array(
			#Лендинг
			'id'=>$params["type_id"],
			'values'=>array(
				array(
					'value'=>$typeId,
				),
			)
		));
	}

	if( isset($_POST["phone"]) && $_POST["phone"] != "" ){
		array_push($custom_fields, array(
			#Телефон
			'id'=>$params["phone_id"], #Уникальный индентификатор заполняемого дополнительного поля
			'values'=>array(
				array(
					'value'=>$_POST["phone"],
					'enum'=>'MOB' #Мобильный
				),
			)
		));
	}
	if( isset($_POST["email"]) && $_POST["email"] != "" ){
		array_push($custom_fields, array(
			#E-mail
			'id'=>$params["email_id"],
			'values'=>array(
				array(
					'value'=>$_POST["email"],
					'enum'=>'WORK', #Рабочий
				),
			)
		));
	}

	$contacts['request']['contacts']['add']=array(
		array(
			'name'=>(isset($_POST["name"])?$_POST["name"]:"Новый контакт"), #Имя контакта
			//'last_modified'=>1298904164, //optional
			'linked_leads_id'=>array( #Список с айдишниками сделок контакта
				$leadId
			),
			'responsible_user_id'=>$userId,
			// 'company_name'=>'amoCRM', #Наименование компании
			// 'tags' => 'Important, USA', #Теги
			'custom_fields'=>$custom_fields
		)
	);

	$subdomain=$params["subdomain"]; #Наш аккаунт - поддомен
	#Формируем ссылку для запроса
	$link='https://'.$subdomain.'.amocrm.ru/private/api/v2/json/contacts/set';

	$request = AmoRequest($link,$contacts);

	$out = $request["out"];
	$code=(int)$request["code"];
	$errors=array(
		301=>'Moved permanently',
		400=>'Bad request',
		401=>'Unauthorized',
		403=>'Forbidden',
		404=>'Not found',
		500=>'Internal server error',
		502=>'Bad gateway',
		503=>'Service unavailable'
	);
	try
	{
		#Если код ответа не равен 200 или 204 - возвращаем сообщение об ошибке
		if($code!=200 && $code!=204)
			throw new Exception(isset($errors[$code]) ? $errors[$code] : 'Undescribed error',$code);
	}
	catch(Exception $E)
	{
		die('Ошибка3: '.$E->getMessage().PHP_EOL.'Код ошибки: '.$E->getCode());
	}
	 
	/**
	 * Данные получаем в формате JSON, поэтому, для получения читаемых данных,
	 * нам придётся перевести ответ в формат, понятный PHP
	 */
	$Response=json_decode($out,true);
	// var_dump($Response);
	$Response=$Response['response']['contacts']['add'];
	 
	$output='';
	foreach($Response as $v)
	  	if(is_array($v))
	    	$output.=$v['id'];
	return $output;
}

function AmoNotes($params, $leadId, $textAr){
	$text = "";

	foreach ($textAr as $key => $value) {
		$text .= ($key.": ".$value."\n");
	}

	$notes['request']['notes']['add']=array(
	  #Привязываем к сделке
	  array(
	    'element_id'=>$leadId,
	    'element_type'=>2,
	    'text'=>$text,
	  )
	);

	$subdomain=$params["subdomain"]; #Наш аккаунт - поддомен
	#Формируем ссылку для запроса
	$link='https://'.$subdomain.'.amocrm.ru/private/api/v2/json/notes/set';

	$request = AmoRequest($link,$notes);

	$code=(int)$request["code"];
	$errors=array(
	  301=>'Moved permanently',
	  400=>'Bad request',
	  401=>'Unauthorized',
	  403=>'Forbidden',
	  404=>'Not found',
	  500=>'Internal server error',
	  502=>'Bad gateway',
	  503=>'Service unavailable'
	);
	try
	{
	  #Если код ответа не равен 200 или 204 - возвращаем сообщение об ошибке
	  if($code!=200 && $code!=204)
	    throw new Exception(isset($errors[$code]) ? $errors[$code] : 'Undescribed error',$code);
	}
	catch(Exception $E)
	{
	  die('Ошибка: '.$E->getMessage().PHP_EOL.'Код ошибки: '.$E->getCode());
	}
	return true;
}

?>