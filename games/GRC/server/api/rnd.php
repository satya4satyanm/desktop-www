<?php

include_once './config/database.php';
require "./vendor/autoload.php";
use \Firebase\JWT\JWT;

$content = file_get_contents('php://input');
$dataArray = explode("::", $content);
$bets = $dataArray[0];
$jwt = $dataArray[1];
$data = base64_decode($bets);


// the below lines are used to restrict XSS attacks
$search = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
$data = json_decode(html_entity_decode($search));
// the above lines are used to restrict XSS attacks

// The below code is for request data validation
$validator = new JsonSchema\Validator;
$validator->validate($data, (object)['$ref' => 'file://' . realpath('schema.json')]);
// The above code is for request data validation
// checking for CSRF with JWT
// preventing SQL injection using PDO

if ($validator->isValid()) {
    ////////////////////////////////////////////////////////////////////
    $secret_key = "YOUR_SECRET_KEY";
    if($jwt){
        try {

            $items = array(1, 10, 9, 8, 7, 6, 5, 4, 3, 2);

            $decoded = JWT::decode($jwt, $secret_key, array('HS256'));
            // Access is granted. Add code of the operation here 
            // echo json_encode($decoded);
            $email = $decoded->data->email;
            $betsArr = $data->bets;
            $balance = $data->balance;
            $game = $data->game;

            $remaining = getNewArray($items, $betsArr);

            $totalBets = 0;
            foreach($betsArr as $value){
                $coin = $value->name;
                $totalBets = $totalBets + substr($coin,1) * 1000;
            }

            if($totalBets > 150000) {
                echo 'wrong input found';
                return;
            }
            
            $totalBalShouldHave = $balance + $totalBets;

            $databaseService = new DatabaseService();
            $conn = $databaseService->getConnection();
            $table_name = 'Users';
            $query = "SELECT balance FROM " . $table_name . " WHERE email = ? LIMIT 0,1";
            $stmt = $conn->prepare( $query );
            $stmt->bindParam(1, $email);
            $stmt->execute();
            $num = $stmt->rowCount();

            if($num > 0){
                $row = $stmt->fetch(PDO::FETCH_ASSOC);
                $balanceInDB = $row['balance'];

                if($totalBalShouldHave == $balanceInDB) {
                    // record every transaction - logs from beginning
                    $gamesTable = 'gamesbank';
                    $query1 = "SELECT bank FROM " . $gamesTable . " WHERE gamename = ? LIMIT 0,1";
                    $stmt1 = $conn->prepare( $query1 );
                    $stmt1->bindParam(1, $game);
                    $stmt1->execute();
                    $num1 = $stmt1->rowCount();

                    if($num1 > 0){
                        $row1 = $stmt1->fetch(PDO::FETCH_ASSOC);
                        $bank = $row1['bank'];
                        
                        $num = getRndNum($remaining);
                        $numIndex = array_search($num, $items);
                        $totalPayout = 0;
                        foreach($betsArr as $value){
                            if('p' . $num == $value->place) {
                                $totalPayout += substr($value->name,1) * 1000 * 10;
                            }
                        }

                        $newBal = $balanceInDB + $totalPayout - $totalBets;

                        $newBank = $bank + $totalBets - $totalPayout;

                        $query2 = "UPDATE gamesbank SET bank=:newbank WHERE gamename=:game";
                        $stmt2 = $conn->prepare( $query2 );
                        $stmt2->bindParam(':newbank', $newBank);
                        $stmt2->bindParam(':game', $game);
                        $stmt2->execute();
                        
                        $query = "UPDATE users SET balance=:bal WHERE email=:email";
                        $stmt = $conn->prepare( $query );
                        $stmt->bindParam(':bal', $newBal);
                        $stmt->bindParam(':email', $email);
                        $stmt->execute();
                        
                        echo ($numIndex + 1) . ":" . $newBank;
                        //print_r($items);

                    }
                    
                    // total max bet
                    // total bet - total payout should be added to bank
                    // timestamp that user clicked on the button also can be submitted
                    //   check bank balance for the game
                    //   generate random number which can give only within bank balance
                    
                } else {
                    echo "We are sure you are trying to hack our system from this IP: " . get_client_ip();
                }
            }

            // Show jackpot amount for the current game

            // Minimum bet to play for jackpot is a 50 chip, implemented at front end,
            // Backend is still pending. and Bonus rounds need to be added

            // change the file names after purchase, may be embed date of purchase, so hackers can't get the file details even they see the source code of this item
        } catch (Exception $e) {
            http_response_code(401);
            echo json_encode(array(
                "message" => "Access denied.",
                "error" => $e->getMessage()
            ));
        }
    }
    ////////////////////////////////////////////////////////////////////

    //  Stop SQL Injection  https://stackoverflow.com/questions/60174/how-can-i-prevent-sql-injection-in-php
    
    // error logs in needed for real time apps

    //https://www.acunetix.com/blog/articles/prevent-sql-injection-vulnerabilities-in-php-applications/

    // Directory traversal (path injection)
    // https://docs.php.earth/security/intro/

} else {
    echo "Malformed input!";
    // below comments can be used by developers only
    // foreach ($validator->getErrors() as $error) {
    //     printf("[%s] %s\n", $error['property'], $error['message']);
    // }
}

function get_client_ip() {
    $ipaddress = '';
    if (isset($_SERVER['HTTP_CLIENT_IP']))
        $ipaddress = $_SERVER['HTTP_CLIENT_IP'];
    else if(isset($_SERVER['HTTP_X_FORWARDED_FOR']))
        $ipaddress = $_SERVER['HTTP_X_FORWARDED_FOR'];
    else if(isset($_SERVER['HTTP_X_FORWARDED']))
        $ipaddress = $_SERVER['HTTP_X_FORWARDED'];
    else if(isset($_SERVER['HTTP_FORWARDED_FOR']))
        $ipaddress = $_SERVER['HTTP_FORWARDED_FOR'];
    else if(isset($_SERVER['HTTP_FORWARDED']))
        $ipaddress = $_SERVER['HTTP_FORWARDED'];
    else if(isset($_SERVER['REMOTE_ADDR']))
        $ipaddress = $_SERVER['REMOTE_ADDR'];
    else
        $ipaddress = 'UNKNOWN';
    return $ipaddress;
}

function getRndNum($arr) {
    $n = count($arr);
    $rnd = rand(1,$n);
    return $arr[$rnd-1];
}

function getNewArray($arr, $bets) {
    
    $c50Bets = array();
    foreach($bets as $value){
        if(substr($value->name,1) == 50) {
            array_push($c50Bets, substr($value->place,1));
        }
    }
    
    $newArray = array_diff($arr, $c50Bets);
    
    for ($x = 0; $x < count($c50Bets); $x++) {
        array_pop($newArray);
    }
    // print_r(array_merge($newArray, $c50Bets));
    return array_merge($newArray, $c50Bets);
}

?>