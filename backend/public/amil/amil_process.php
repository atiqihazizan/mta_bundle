<?php
require_once 'amil_functions.php';

// Semak jika form telah dihantar
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = isset($_POST['action']) ? $_POST['action'] : '';
    
    // Proses berdasarkan jenis tindakan
    switch ($action) {
        case 'add':
        case 'update':
            processAmilData($action);
            break;
            
        case 'delete':
            deleteAmilData();
            break;
            
        default:
            setMessage('error', 'Tindakan tidak sah.');
            header('Location: amil_list.php');
            exit;
    }
} else {
    // Jika bukan POST request, redirect ke senarai amil
    header('Location: amil_list.php');
    exit;
}

// Fungsi untuk memproses data amil (tambah atau kemaskini)
function processAmilData($action) {
    // Dapatkan data dari form
    $name = isset($_POST['name']) ? trim($_POST['name']) : '';
    $originalName = isset($_POST['original_name']) ? trim($_POST['original_name']) : '';
    $kuponData = isset($_POST['kupon']) ? $_POST['kupon'] : [];
    
    // Validasi data
    if (empty($name)) {
        setMessage('error', 'Nama amil tidak boleh kosong.');
        header('Location: amil_form.php');
        exit;
    }
    
    // Jika ini adalah update dan nama telah berubah, padam rekod lama
    if ($action === 'update' && $originalName !== $name) {
        deleteAmil($originalName);
    }
    
    // Susun data amil
    $amilData = [
        'name' => $name
    ];
    
    // Proses data kupon
    $kuponTypes = getKuponTypes();
    foreach ($kuponTypes as $kuponType) {
        $amilData[$kuponType] = [];
        
        if (isset($kuponData[$kuponType])) {
            $prefixes = $kuponData[$kuponType]['prefix'] ?? [];
            $numbers = $kuponData[$kuponType]['number'] ?? [];
            $starts = $kuponData[$kuponType]['start'] ?? [];
            $ends = $kuponData[$kuponType]['end'] ?? [];
            $qrs = $kuponData[$kuponType]['qr'] ?? [];
            
            $count = count($prefixes);
            for ($i = 0; $i < $count; $i++) {
                if (!empty($prefixes[$i]) && !empty($numbers[$i])) {
                    $kuponCode = $prefixes[$i] . $numbers[$i];
                    $startValue = !empty($starts[$i]) ? (int)$starts[$i] : 0;
                    $endValue = !empty($ends[$i]) ? (int)$ends[$i] : 0;
                    $qrCount = !empty($qrs[$i]) ? (int)$qrs[$i] : 0;
                    
                    $amilData[$kuponType][$kuponCode] = [$startValue, $endValue, $qrCount];
                }
            }
        }
    }
    
    // Simpan data amil
    $result = saveAmil($amilData);
    if ($result[0]) {
        $message = ($action === 'add') ? 'Amil berjaya ditambah.' : 'Amil berjaya dikemaskini.';
        setMessage('success', $message);
    } else {
        setMessage('error', 'Gagal menyimpan data amil: ' . $result[1]);
    }
    
    header('Location: amil_list.php');
    exit;
}

// Fungsi untuk memadam data amil
function deleteAmilData() {
    $originalName = isset($_POST['original_name']) ? trim($_POST['original_name']) : '';
    
    if (empty($originalName)) {
        setMessage('error', 'Nama amil tidak sah.');
        header('Location: amil_list.php');
        exit;
    }
    
    $result = deleteAmil($originalName);
    if ($result[0]) {
        setMessage('success', 'Amil berjaya dipadam.');
    } else {
        setMessage('error', 'Gagal memadam amil: ' . $result[1]);
    }
    
    header('Location: amil_list.php');
    exit;
}

// Fungsi untuk menetapkan mesej
function setMessage($type, $message) {
    session_start();
    $_SESSION['message'] = [
        'type' => $type,
        'text' => $message
    ];
}
?>
