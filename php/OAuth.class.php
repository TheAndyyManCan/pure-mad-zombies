<?php
require_once('defs.php');

class curlHandler {

	private $curl;

	public function __construct($url=''){
		$this->setCurl(curl_init($url));
		curl_setopt($this->getCurl(), CURLOPT_IPRESOLVE, CURL_IPRESOLVE_V4);
		curl_setopt($this->getCurl(), CURLOPT_RETURNTRANSFER, TRUE);
		curl_setopt($this->getCurl(), CURLOPT_USERAGENT, $_SERVER['HTTP_USER_AGENT']);
		curl_setopt($this->getCurl(), CURLOPT_HTTPHEADER, array(['Content-type: application/x-www-form-urlencoded']));
		$this->setPost();
	}

	// Class getters and setters
	public function getCurl(){return $this->curl;}

	private function setCurl($curl){$this->curl = $curl;}

	public function setPost($value = true){
		curl_setopt($this->getCurl(), CURLOPT_POST, $value);
	}

	public function setQuery($query = []){
		curl_setopt($this->getCurl(), CURLOPT_POSTFIELDS, http_build_query($query));
	}

	public function setHeader($header){
		curl_setopt($this->getCurl(), CURLOPT_HTTPHEADER, $header);
	}

	public function runCurl(){
		return curl_exec($this->getCurl());
	}

}

class OAuth {

	private $providerName, $authUrl, $tokenUrl, $apiUrl, $revokeUrl, $scope;
	private $userInfo;
	protected $secret, $cid;

	public function __construct($providerInfo, $cid, $secret){
		$this->providerName = $providerInfo['providername'];
		$this->authUrl = $providerInfo['data']['authURL'];
		$this->tokenUrl = $providerInfo['data']['tokenURL'];
		$this->apiUrl = $providerInfo['data']['apiURL'];
		$this->revokeUrl = $providerInfo['data']['revokeURL'];
		$this->scope = $providerInfo['data']['scope'];
		$this->secret = $secret;
		$this->cid = $cid;
	}

	// Class getters and setters
	public function getProviderName(){return $this->providerName;}
	public function getAuthUrl(){return $this->authUrl;}
	public function getTokenUrl(){return $this->tokenUrl;}
	public function getApiUrl(){return $this->apiUrl;}
	public function getRevokeUrl(){return $this->revokeUrl;}
	public function getScope(){return $this->scope;}
	public function getUserInfo(){return $this->userInfo;}

	private function setProviderName($providerName){$this->providerName = $providerName;}
	private function setAuthUrl($authUrl){$this->authUrl = $authUrl;}
	private function setTokenUrl($tokenUrl){$this->tokenUrl = $tokenUrl;}
	private function setApiUrl($apiUrl){$this->apiUrl = $apiUrl;}
	private function setRevokeUrl($revokeUrl){$this->revokeUrl = $revokeUrl;}
	private function setScope($scope){$this->scope = $scope;}
	private function setUserInfo($userInfo){$this->userInfo = $userInfo;}

	public function generateLoginText(){
		return '<p><a href="?action=login&provider='.$this->providerName.'">Login '.$this->providerName.'</a></p>';
	}

	public function login(){
		$params = array(
			'client_id' => $this->cid,
			'redirect_uri' => REDIRECTURI,
			'response_type' => 'code',
			'scope' => $this->getScope()
		);

		header('Location: '.$this->getAuthUrl().'?'.http_build_query($params));
		die();
	}

	public function getAuth($code){
		$curl = new curlHandler($this->getTokenUrl());
		$headers = array(
			'Accept: application/json'
		);
		$curl->setHeader($headers);
		$params = array(
			'grant_type' => 'authorization_code',
			'client_id' => $this->cid,
			'client_secret' => $this->secret,
			'redirect_uri' => REDIRECTTOKENURI,
			'code' => $code
		);
		$curl->setQuery($params);
		$result = json_decode($curl->runCurl());
		return $result;
	}

	public function getAuthConfirm($token){
		$curl = new curlHandler($this->getApiUrl());
		$curl->setPost(false);
		$headers = array(
			'Accept: application/json',
			'Authorization: Bearer '.$token
		);
		$curl->setHeader($headers);
		$result = json_decode($curl->runCurl());
		$this->setUserInfo($result);
	}

	public function getAvatar(){
		return 'https://cdn.discordapp.com/avatars/'.$this->getUserInfo()->id.'/'.$this->getUserInfo()->avatar.'.png';
	}
}

class ProviderHandler {

	private $providerList = [];
	private $action, $activeProvider, $code, $accessToken, $status, $providerInstance;

	//Class getters and setters
	public function getProviderList(){return $this->providerList;}
	public function getAction(){return $this->action;}
	public function getCode(){return $this->code;}
	public function getAccessToken(){return $this->accessToken;}
	public function getStatus(){return $this->status;}
	public function getProviderInstance(){return $this->providerInstance;}
	public function getActiveProvider(){return $this->activeProvider;}

	private function setProviderList($providerList){$this->providerList = $providerList;}
	private function setActiveProvider($activeProvider){$this->activeProvider = $activeProvider;}
	private function setCode($code){$this->code = $code;}
	private function setAccessToken($accessToken){$this->accessToken = $accessToken;}
	private function setStatus($status){$this->status = $status;}
	private function setProviderInstance($providerInstance){$this->providerInstance = $providerInstance;}

	public function __construct(){
		if(session_status() !== PHP_SESSION_ACTIVE){
			session_start();
		}
		$this->action = $this->getGetParam('action');
		if($this->getGetParam('provider')) $this->activeProvider = $this->getGetParam('provider');
		else $this->activeProvider = $this->getSessionValue('provider');
		$this->setCode($this->getGetParam('code'));
		$this->setAccessToken($this->getSessionValue('access_token'));
	}

	public function performAction(){
		foreach($this->providerList as $provider){
			if($provider->getProviderName() == $this->getActiveProvider()){
				$this->setProviderInstance($provider);
				if($this->action == 'login'){
					$this->login();
				} else if($this->action == 'logout'){
					$this->logout();
				} else if($this->getSessionValue('access_token')){
					$this->processToken();
				} else if($this->getCode()){
					$this->processCode();
				}
			}
		}
	}

	public function processCode(){
		$result = $this->getProviderInstance()->getAuth($this->code);
		if($result->access_token){
			$this->setStatus('logged in');
			$this->setSessionValue('access_token', $result->access_token);
			$this->processToken($result->access_token);
		}
	}

	public function processToken(){
		$this->setStatus('logged in');
		$this->getProviderInstance()->getAuthConfirm($this->getSessionValue('access_token'));
	}

	public function addProvider($name, $cid, $secret){
		$providerInfo = $this->getProviderData($name);
		if($providerInfo !== null){
			array_push($this->providerList, new $providerInfo['data']['class']($providerInfo, $cid, $secret));
		}
	}

	public function getProviderData($name){
		foreach(PROVIDERLIST as $provider){
			if($provider['providername'] == $name){
				return $provider;
			}

			return null;
		}
	}

	public function generateLoginText(){
		$result = '';
		foreach($this->providerList as $provider){
			$result .= $provider->generateLoginText();
		}
		return $result;
	}

	public function getGetParam($key, $default=null){
		return array_key_exists($key, $_GET) ? $_GET[$key] : $default;
	}

	public function getSessionValue($key, $default=null){
		return array_key_exists($key, $_SESSION) ? $_SESSION[$key] : $default;
	}

	public function setSessionValue($key, $value){
		$_SESSION[$key] = $value;
	}

	public function login(){
		$this->setSessionValue('provider', $this->providerInstance->getProviderName());
		$this->setStatus('logging in');
		$this->getProviderInstance()->login();
	}

	public function logout(){
		$this->setStatus('logged out');
		session_unset();
		header('Location: '.$_SERVER['PHP_SELF']);
		die();
	}

	public function generateLogoutButton(){
		return '<p><a href="?action=logout">Logout</a></p>';
	}
}
