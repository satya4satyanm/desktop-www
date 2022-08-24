<?php
include_once './config/database.php';

$email = '';
$password = '';
$conn = null;

$databaseService = new DatabaseService();
$conn = $databaseService->getConnection();

$data = json_decode(file_get_contents("php://input"));

$email = $data->email;
$password = $data->password;

$table_name = 'users';

$query = "INSERT INTO " . $table_name . "
                SET email = :email,
                    password = :password,
                    balance = 100000";

$stmt = $conn->prepare($query);

$stmt->bindParam(':email', $email);

$password_hash = password_hash($password, PASSWORD_BCRYPT);
$stmt->bindParam(':password', $password_hash);

if($stmt->execute()){
    http_response_code(200);
    echo json_encode(array("message" => "User was successfully registered."));
}
else{
    http_response_code(400);
    echo json_encode(array("message" => "Unable to register the user."));
}
?>