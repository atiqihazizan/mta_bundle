<?php
require_once 'amil_functions.php';

// Semak jika nama amil diberikan
if (!isset($_GET['name'])) {
    header('Location: amil_list.php');
    exit;
}

$amilName = $_GET['name'];
$amil = getAmilByName($amilName);

if (!$amil) {
    session_start();
    $_SESSION['message'] = [
        'type' => 'error',
        'text' => 'Amil tidak dijumpai.'
    ];
    header('Location: amil_list.php');
    exit;
}

// Senarai jenis kupon
$kuponTypes = getKuponTypes();
?>

<!DOCTYPE html>
<html lang="ms">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Maklumat Amil: <?php echo htmlspecialchars($amil['name']); ?></title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        h1, h2 {
            margin-bottom: 20px;
        }
        h1 {
            text-align: center;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }
        .btn {
            padding: 8px 15px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            text-decoration: none;
            display: inline-block;
        }
        .btn-primary {
            background-color: #4CAF50;
            color: white;
        }
        .btn-secondary {
            background-color: #2196F3;
            color: white;
        }
        .kupon-section {
            margin-bottom: 30px;
            border: 1px solid #ddd;
            padding: 15px;
            border-radius: 4px;
        }
        .kupon-header {
            background-color: #f2f2f2;
            padding: 10px;
            margin: -15px -15px 15px -15px;
            border-bottom: 1px solid #ddd;
            border-radius: 4px 4px 0 0;
        }
        .kupon-item {
            margin-bottom: 15px;
            padding-bottom: 15px;
            border-bottom: 1px dashed #eee;
        }
        .kupon-item:last-child {
            border-bottom: none;
            margin-bottom: 0;
            padding-bottom: 0;
        }
        .kupon-code {
            font-weight: bold;
            font-size: 18px;
            margin-bottom: 10px;
        }
        .receipt-range {
            display: flex;
            gap: 20px;
        }
        .receipt-info {
            flex: 1;
            padding: 10px;
            background-color: #f9f9f9;
            border-radius: 4px;
            width: 33%;
        }
        .receipt-info p {
            margin: 5px 0;
        }
        .receipt-label {
            font-weight: bold;
        }
        .kupon-7 .kupon-header {
            background-color: #FF9800;
            color: white;
        }
        .kupon-10 .kupon-header {
            background-color: #2196F3;
            color: white;
        }
        .kupon-15 .kupon-header {
            background-color: #4CAF50;
            color: white;
        }
        .kupon-25 .kupon-header {
            background-color: #9C27B0;
            color: white;
        }
        .buttons {
            margin-top: 20px;
            text-align: center;
        }
        .buttons .btn {
            margin: 0 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Maklumat Amil</h1>
            <a href="amil_list.php" class="btn btn-secondary">Kembali ke Senarai</a>
        </div>
        
        <h2><?php echo htmlspecialchars($amil['name']); ?></h2>
        
        <?php foreach ($kuponTypes as $kuponType): ?>
            <?php if (isset($amil[$kuponType]) && !empty($amil[$kuponType])): ?>
                <div class="kupon-section kupon-<?php echo $kuponType; ?>">
                    <div class="kupon-header">
                        <h3>Kupon <?php echo $kuponType; ?></h3>
                    </div>
                    
                    <?php foreach ($amil[$kuponType] as $kuponCode => $kuponValues): ?>
                        <div class="kupon-item">
                            <div class="kupon-code">
                                No. Buku: <?php echo htmlspecialchars($kuponCode); ?>
                            </div>
                            <?php
                                // Senario 1: array[0] != empty && array[1] == 0 - kesemua resit telah dikeluarkan (50 keping)
                                // Senario 2: array[0] != empty && array[1] != empty - resit dikeluarkan dari dan sehingga sahaja
                                // Senario 3: array[0] == 0 && array[1] != empty - buku tidak digunakan lagi, no resit dari awal adalah array[1]
                                
                                $startValue = isset($kuponValues[0]) ? $kuponValues[0] : 0;
                                $endValue = isset($kuponValues[1]) ? $kuponValues[1] : 0;
                                $qrCount = isset($kuponValues[2]) ? $kuponValues[2] : 0;
                                
                                if ($startValue != 0 && $endValue == 0) {
                                    // Senario 1: Kesemua resit telah dikeluarkan
                                    $status = '<span style="color: green; font-weight: bold;">Semua 50 resit telah dikeluarkan</span>';
                                    $endCalc = $startValue + 49; // 50 resit bermula dari startValue
                                    

                                } elseif ($startValue != 0 && $endValue != 0) {
                                    // Senario 2: Resit dikeluarkan dari dan sehingga sahaja
                                    $status = '<span style="color: blue; font-weight: bold;">Resit dikeluarkan sebahagian</span>';
                                    $endCalc = $endValue;
                                    

                                } elseif ($startValue == 0 && $endValue != 0) {
                                    // Senario 3: Buku tidak digunakan lagi
                                    $status = '<span style="color: red; font-weight: bold;">Buku tidak digunakan</span>';
                                    $endCalc = $endValue;
                                } else {
                                    // Tiada maklumat
                                    $status = '<span style="color: gray; font-weight: bold;">Tiada maklumat</span>';
                                    $endCalc = 'Belum ditetapkan';
                                }
                                ?>
                            <div class="receipt-range">
                                <div class="receipt-info">
                                    <p><span class="receipt-label">No. Resit Mula:</span> <?php echo $startValue ?: 'Belum ditetapkan'; ?></p>
                                </div>
                                <div class="receipt-info">
                                    <p><span class="receipt-label">No. Resit Akhir:</span> <?php echo $endCalc; ?></p>
                                </div>
                                <div class="receipt-info">
                                    <p><span class="receipt-label">Bilangan QR:</span> <?php echo $qrCount ?: '0'; ?></p>
                                </div>
                            </div>
                            <div style="margin-top: 10px; padding: 10px; background-color: #f9f9f9; border-radius: 4px;">
                                <p><span style="font-weight: bold;">Status:</span> <?php echo $status; ?></p>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>
        <?php endforeach; ?>
        
        <div class="buttons">
            <a href="amil_form.php?name=<?php echo urlencode($amil['name']); ?>" class="btn btn-primary">Edit Maklumat</a>
        </div>
    </div>
</body>
</html>
