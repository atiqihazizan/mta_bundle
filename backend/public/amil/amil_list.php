<?php
require_once 'amil_functions.php';

// Dapatkan senarai amil
$amilList = getAmilData();

// Semak jika ada mesej
session_start();
$message = null;
if (isset($_SESSION['message'])) {
    $message = $_SESSION['message'];
    unset($_SESSION['message']);
}
?>

<!DOCTYPE html>
<html lang="ms">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Senarai Amil</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 1000px;
            margin: 0 auto;
            background: white;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        h1 {
            text-align: center;
            margin-bottom: 20px;
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
        .btn-danger {
            background-color: #f44336;
            color: white;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        th, td {
            padding: 10px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        th {
            background-color: #f2f2f2;
            font-weight: bold;
        }
        tr:hover {
            background-color: #f5f5f5;
        }
        .actions {
            display: flex;
            gap: 5px;
        }
        .message {
            padding: 10px;
            margin-bottom: 20px;
            border-radius: 4px;
        }
        .message-success {
            background-color: #dff0d8;
            color: #3c763d;
            border: 1px solid #d6e9c6;
        }
        .message-error {
            background-color: #f2dede;
            color: #a94442;
            border: 1px solid #ebccd1;
        }
        .kupon-badge {
            display: inline-block;
            padding: 3px 7px;
            margin: 2px;
            border-radius: 3px;
            font-size: 12px;
            color: white;
        }
        .kupon-7 {
            background-color: #FF9800;
        }
        .kupon-10 {
            background-color: #2196F3;
        }
        .kupon-15 {
            background-color: #4CAF50;
        }
        .kupon-25 {
            background-color: #9C27B0;
        }
    </style>
</head>
<body>
    <div class="container">
        <?php if ($message): ?>
        <div class="message message-<?php echo $message['type']; ?>">
            <?php echo $message['text']; ?>
        </div>
        <?php endif; ?>
        
        <div class="header">
            <h1>Senarai Amil</h1>
            <div>
              <a href="amil_form.php" class="btn btn-primary">Tambah Amil Baru</a>
              <a href="index.html" class="btn btn-secondary">Kembali</a>
            </div>
        </div>
        
        <?php if (empty($amilList)): ?>
            <p>Tiada amil dalam senarai.</p>
        <?php else: ?>
            <table>
                <thead>
                    <tr>
                        <th>Nama Amil</th>
                        <th>Kupon</th>
                        <th>Tindakan</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($amilList as $amil): ?>
                        <tr>
                            <td><?php echo htmlspecialchars($amil['name']); ?></td>
                            <td>
                                <?php foreach (getKuponTypes() as $kuponType): ?>
                                    <?php if (isset($amil[$kuponType]) && !empty($amil[$kuponType])): ?>
                                        <span class="kupon-badge kupon-<?php echo $kuponType; ?>">
                                            Kupon <?php echo $kuponType; ?> (<?php echo count($amil[$kuponType]); ?>)
                                        </span>
                                    <?php endif; ?>
                                <?php endforeach; ?>
                            </td>
                            <td class="actions">
                                <a href="amil_form.php?name=<?php echo urlencode($amil['name']); ?>" class="btn btn-secondary">Edit</a>
                                <a href="amil_detail.php?name=<?php echo urlencode($amil['name']); ?>" class="btn btn-primary">Lihat</a>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        <?php endif; ?>
    </div>
</body>
</html>
