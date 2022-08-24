<?php
include_once './config/database.php';
require "./vendor/autoload.php";
use \Firebase\JWT\JWT;

/*https://www.techiediaries.com/php-jwt-authentication-tutorial/ */
$email = '';
$password = '';

$databaseService = new DatabaseService();
$conn = $databaseService->getConnection();

$data = json_decode(file_get_contents("php://input"));

$email = $data->email;
$password = $data->password;
$game = $data->game;

$table_name = 'users';

$query = "SELECT id, password, balance FROM " . $table_name . " WHERE email = ? LIMIT 0,1";

$stmt = $conn->prepare( $query );
$stmt->bindParam(1, $email);
$stmt->execute();
$num = $stmt->rowCount();

if($num > 0){
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    $id = $row['id'];
    $password2 = $row['password'];
    $bal = $row['balance'];
    if(password_verify($password, $password2))
    {
        $secret_key = "YOUR_SECRET_KEY";
        $issuer_claim = "THE_ISSUER"; // this can be the servername
        $audience_claim = "THE_AUDIENCE";
        $issuedat_claim = time(); // issued at
        $notbefore_claim = $issuedat_claim + 1; //not before in seconds
        $expire_claim = $issuedat_claim + 6000; // expire time in seconds 5 min
        $token = array(
            "iss" => $issuer_claim,
            "aud" => $audience_claim,
            "iat" => $issuedat_claim,
            "nbf" => $notbefore_claim,
            "exp" => $expire_claim,
            "data" => array(
                "id" => $id,
                "email" => $email
        ));

        http_response_code(200);

        $jwt = JWT::encode($token, $secret_key);


        $gamesTable = 'gamesbank';

        $query1 = "SELECT bank FROM " . $gamesTable . " WHERE gamename = ? LIMIT 0,1";

        $stmt1 = $conn->prepare( $query1 );
        $stmt1->bindParam(1, $game);
        $stmt1->execute();
        $num1 = $stmt1->rowCount();

        if($num1 > 0){
            $row1 = $stmt1->fetch(PDO::FETCH_ASSOC);
            $bank = $row1['bank'];
            echo json_encode(
                array(
                    "message" => "Successful login.",
                    "jwt" => $jwt,
                    "email" => $email,
                    "bal" => $bal,
                    "expireAt" => $expire_claim,
                    "bank" => $bank
                ));
        }
    }
    else{
        http_response_code(401);
        echo json_encode(array("message" => "Login failed.", "password" => $password));
    }
}
?>