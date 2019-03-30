<?php 

function isInDatabase($leagueID, $season) {
    $flag = false;
    $link = mysql_connect('sethie7464415.ipagemysql.com', 'fan_guest_0', 'fantasyGuest');
    if (!$link) {
        die('Not connected : ' . mysql_error());
    }
    
    // make foo the current db
    $db_selected = mysql_select_db('fantasy_v1', $link);
    if (!$db_selected) {
        die ('Can\'t use foo : ' . mysql_error());
    }
    $query = "SELECT * FROM leagues WHERE leagueID = '$leagueID' AND (season = $season)";
    $result = mysql_query($query);
    if(mysql_num_rows($result) > 0){
        return $result;
    }
    else{
        return $flag;
    }
    
}

function storeLeagueData($leagueID, $season, $leagueObject) {
    $conn = new mysqli('sethie7464415.ipagemysql.com', 'fan_guest_0', 'fantasyGuest', 'fantasy_v1');
    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    } 

    $sql = "INSERT INTO leagues ('leagueID', 'season', 'platform', 'leagueObject')
    VALUES ($leagueID, $season, 'ESPN', $leagueObject)";

    if ($conn->query($sql) === TRUE) {
        echo "New record created successfully";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }

    $conn->close();
    
}

/*
$link = mysql_connect('sethie7464415.ipagemysql.com', 'fan_guest_0', 'fantasyGuest'); 
if (!$link) {
    die('Not connected : ' . mysql_error());
}

// make foo the current db
$db_selected = mysql_select_db('fantasy_v1', $link);
if (!$db_selected) {
    die ('Can\'t use foo : ' . mysql_error());
}
*/
?> 