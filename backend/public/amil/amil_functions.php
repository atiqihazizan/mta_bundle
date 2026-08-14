<?php
// Fungsi untuk mendapatkan semua data amil
function getAmilData() {
    $jsonFile = "amil.json";
    if (file_exists($jsonFile)) {
        $jsonData = file_get_contents($jsonFile);
        return json_decode($jsonData, true);
    }
    return array();
}

// Fungsi untuk menyimpan data amil
function saveAmilData($data) {
    $jsonFile = "amil.json";
    $error = "";
    
    // Semak jika fail boleh ditulis
    if (file_exists($jsonFile) && !is_writable($jsonFile)) {
        $error = "Fail amil.json tidak boleh ditulis. Sila semak kebenaran fail.";
        error_log($error);
        return array(false, $error);
    }
    
    // Buat backup sebelum menyimpan
    if (file_exists($jsonFile)) {
        $backupFile = "backup/amil.json.bak." . date("YmdHis");
        if (!is_dir("backup")) {
            if (!mkdir("backup", 0755, true)) {
                $error = "Gagal mencipta direktori backup.";
                error_log($error);
                return array(false, $error);
            }
        }
        
        if (!copy($jsonFile, $backupFile)) {
            $error = "Gagal membuat backup fail amil.json.";
            error_log($error);
            // Teruskan walaupun backup gagal
        }
    }
    
    // Encode data ke JSON
    $jsonData = json_encode($data, JSON_PRETTY_PRINT);
    if ($jsonData === false) {
        $error = "Gagal mengenkod data ke format JSON: " . json_last_error_msg();
        error_log($error);
        return array(false, $error);
    }
    
    // Tulis ke fail
    $result = file_put_contents($jsonFile, $jsonData);
    if ($result === false) {
        $error = "Gagal menulis ke fail amil.json.";
        error_log($error);
        return array(false, $error);
    }
    
    return array(true, "");
}

// Fungsi untuk mendapatkan satu amil berdasarkan nama
function getAmilByName($name) {
    $amilData = getAmilData();
    foreach ($amilData as $amil) {
        if ($amil["name"] === $name) {
            return $amil;
        }
    }
    return null;
}

// Fungsi untuk menambah atau mengemaskini amil
function saveAmil($amilData) {
    $allAmil = getAmilData();
    $found = false;
    
    // Cari jika amil sudah wujud
    foreach ($allAmil as $key => $amil) {
        if ($amil["name"] === $amilData["name"]) {
            $allAmil[$key] = $amilData;
            $found = true;
            break;
        }
    }
    
    // Jika amil tidak wujud, tambah baru
    if (!$found) {
        $allAmil[] = $amilData;
    }
    
    $result = saveAmilData($allAmil);
    return $result;
}

// Fungsi untuk memadam amil
function deleteAmil($name) {
    $allAmil = getAmilData();
    $newAmilList = array();
    
    foreach ($allAmil as $amil) {
        if ($amil["name"] !== $name) {
            $newAmilList[] = $amil;
        }
    }
    
    $result = saveAmilData($newAmilList);
    return $result;
}

// Fungsi untuk mendapatkan senarai jenis kupon
function getKuponTypes() {
    return array("7", "10", "15", "25");
}

// Fungsi untuk menjana nombor siri resit dalam satu buku
function generateReceiptNumbers($startNumber) {
    $receipts = array();
    $startNumber = (int)$startNumber;
    
    // Setiap buku mempunyai 50 resit
    for ($i = 0; $i < 50; $i++) {
        $receipts[] = $startNumber + $i;
    }
    
    return $receipts;
}

// Fungsi untuk mendapatkan bilangan QR yang digunakan
function getQRCount($startValue, $endValue) {
    // Jika tiada nilai mula dan akhir, tiada QR digunakan
    if ($startValue == 0 && $endValue == 0) {
        return 0;
    }
    
    // Jika nilai mula ada tetapi nilai akhir tiada, semua 50 resit digunakan
    if ($startValue != 0 && $endValue == 0) {
        return 50;
    }
    
    // Jika nilai mula tiada tetapi nilai akhir ada, buku tidak digunakan
    if ($startValue == 0 && $endValue != 0) {
        return 0;
    }
    
    // Jika kedua-dua nilai ada, kira bilangan resit yang digunakan
    return ($endValue - $startValue) + 1;
}
?>
