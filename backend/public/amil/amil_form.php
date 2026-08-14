<?php
require_once 'amil_functions.php';

// Inisialisasi variabel
$editMode = false;
$amilData = [
    'name' => '',
    '7' => [],
    '10' => [],
    '15' => [],
    '25' => []
];

// Semak jika ini adalah edit mode
if (isset($_GET['name'])) {
    $editMode = true;
    $amilName = $_GET['name'];
    $amil = getAmilByName($amilName);
    if ($amil) {
        $amilData = $amil;
    }
}

// Senarai jenis kupon
$kuponTypes = getKuponTypes();
?>

<!DOCTYPE html>
<html lang="ms">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $editMode ? 'Edit' : 'Tambah'; ?> Maklumat Amil</title>
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
        h1 {
            text-align: center;
            margin-bottom: 20px;
        }
        .form-group {
            margin-bottom: 15px;
        }
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }
        input[type="text"] {
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-sizing: border-box;
        }
        .kupon-section {
            margin-top: 20px;
            border: 1px solid #ddd;
            padding: 15px;
            border-radius: 4px;
            background-color: #f9f9f9;
        }
        .kupon-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }
        .kupon-item {
            border: 1px solid #eee;
            padding: 10px;
            margin-bottom: 10px;
            border-radius: 4px;
            background-color: white;
        }
        .kupon-row {
            display: flex;
            gap: 10px;
            margin-bottom: 10px;
        }
        .kupon-row input {
            flex: 1;
        }
        .btn {
            padding: 8px 15px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        }
        .btn-primary {
            background-color: #4CAF50;
            color: white;
        }
        .btn-danger {
            background-color: #f44336;
            color: white;
        }
        .btn-secondary {
            background-color: #2196F3;
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
        <h1><?php echo $editMode ? 'Edit' : 'Tambah'; ?> Maklumat Amil</h1>
        
        <form action="amil_process.php" method="post" id="amilForm">
            <input type="hidden" name="action" value="<?php echo $editMode ? 'update' : 'add'; ?>">
            <?php if ($editMode): ?>
                <input type="hidden" name="original_name" value="<?php echo htmlspecialchars($amilData['name']); ?>">
            <?php endif; ?>
            
            <div class="form-group">
                <label for="name">Nama Amil:</label>
                <input type="text" id="name" name="name" value="<?php echo htmlspecialchars($amilData['name']); ?>" required>
            </div>
            
            <?php foreach ($kuponTypes as $kuponType): ?>
                <div class="kupon-section" id="kupon-section-<?php echo $kuponType; ?>">
                    <div class="kupon-header">
                        <h3>Kupon <?php echo $kuponType; ?></h3>
                        <button type="button" class="btn btn-secondary add-kupon" data-type="<?php echo $kuponType; ?>">Tambah Buku</button>
                    </div>
                    
                    <div class="kupon-items" id="kupon-items-<?php echo $kuponType; ?>">
                        <?php 
                        if (isset($amilData[$kuponType]) && !empty($amilData[$kuponType])): 
                            foreach ($amilData[$kuponType] as $kuponCode => $kuponValues):
                                $prefix = substr($kuponCode, 0, 1);
                                $number = substr($kuponCode, 1);
                                $startValue = isset($kuponValues[0]) ? $kuponValues[0] : 0;
                                $endValue = isset($kuponValues[1]) ? $kuponValues[1] : 0;
                        ?>
                        <div class="kupon-item">
                            <div class="kupon-row">
                                <div class="form-group">
                                    <label>Prefix:</label>
                                    <input type="text" name="kupon[<?php echo $kuponType; ?>][prefix][]" value="<?php echo htmlspecialchars($prefix); ?>" maxlength="1" required>
                                </div>
                                <div class="form-group">
                                    <label>No. Buku:</label>
                                    <input type="text" name="kupon[<?php echo $kuponType; ?>][number][]" value="<?php echo htmlspecialchars($number); ?>" required>
                                </div>
                            </div>
                            <div class="kupon-row">
                                <div class="form-group">
                                    <label>No. Resit Mula:</label>
                                    <input type="number" name="kupon[<?php echo $kuponType; ?>][start][]" value="<?php echo htmlspecialchars($startValue); ?>">
                                </div>
                                <div class="form-group">
                                    <label>No. Resit Akhir:</label>
                                    <input type="number" name="kupon[<?php echo $kuponType; ?>][end][]" value="<?php echo htmlspecialchars($endValue); ?>">
                                </div>
                                <div class="form-group">
                                    <label>Bilangan QR:</label>
                                    <?php 
                                    $qrCount = isset($kuponValues[2]) ? $kuponValues[2] : '';
                                    ?>
                                    <input type="number" name="kupon[<?php echo $kuponType; ?>][qr][]" value="<?php echo htmlspecialchars($qrCount); ?>" placeholder="Bilangan QR yang digunakan">
                                </div>
                            </div>
                            <div class="form-group">
                                <div style="background-color: #f0f0f0; padding: 10px; border-radius: 4px; margin-top: 10px; font-size: 12px;">
                                    <strong>Panduan:</strong>
                                    <ul style="margin: 5px 0 0 20px; padding: 0;">
                                        <li>Jika <strong>Mula ≠ 0</strong> dan <strong>Akhir = 0</strong>: Semua 50 resit telah dikeluarkan</li>
                                        <li>Jika <strong>Mula ≠ 0</strong> dan <strong>Akhir ≠ 0</strong>: Resit dikeluarkan dari nombor Mula hingga nombor Akhir sahaja</li>
                                        <li>Jika <strong>Mula = 0</strong> dan <strong>Akhir ≠ 0</strong>: Buku tidak digunakan, nombor Akhir adalah nombor resit pertama</li>
                                    </ul>
                                </div>
                            </div>
                            <button type="button" class="btn btn-danger remove-kupon">Buang</button>
                        </div>
                        <?php 
                            endforeach;
                        endif; 
                        ?>
                    </div>
                </div>
            <?php endforeach; ?>
            
            <div class="buttons">
                <button type="submit" class="btn btn-primary"><?php echo $editMode ? 'Kemaskini' : 'Simpan'; ?></button>
                <a href="amil_list.php" class="btn btn-secondary">Kembali</a>
                <?php if ($editMode): ?>
                <button type="button" class="btn btn-danger" id="deleteBtn">Padam</button>
                <?php endif; ?>
            </div>
        </form>
    </div>
    
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Tambah kupon baru
            document.querySelectorAll('.add-kupon').forEach(function(button) {
                button.addEventListener('click', function() {
                    const kuponType = this.getAttribute('data-type');
                    const kuponItemsContainer = document.getElementById(`kupon-items-${kuponType}`);
                    
                    const newItem = document.createElement('div');
                    newItem.className = 'kupon-item';
                    newItem.innerHTML = `
                        <div class="kupon-row">
                            <div class="form-group">
                                <label>Prefix:</label>
                                <input type="text" name="kupon[${kuponType}][prefix][]" maxlength="1" required>
                            </div>
                            <div class="form-group">
                                <label>No. Buku:</label>
                                <input type="text" name="kupon[${kuponType}][number][]" required>
                            </div>
                        </div>
                        <div class="kupon-row">
                            <div class="form-group">
                                <label>No. Resit Mula:</label>
                                <input type="number" name="kupon[${kuponType}][start][]">
                            </div>
                            <div class="form-group">
                                <label>No. Resit Akhir:</label>
                                <input type="number" name="kupon[${kuponType}][end][]">
                            </div>
                            <div class="form-group">
                                <label>Bilangan QR:</label>
                                <input type="number" name="kupon[${kuponType}][qr][]" placeholder="Bilangan QR yang digunakan">
                            </div>
                        </div>
                        <div class="form-group">
                            <div style="background-color: #f0f0f0; padding: 10px; border-radius: 4px; margin-top: 10px; font-size: 12px;">
                                <strong>Panduan:</strong>
                                <ul style="margin: 5px 0 0 20px; padding: 0;">
                                    <li>Jika <strong>Mula ≠ 0</strong> dan <strong>Akhir = 0</strong>: Semua 50 resit telah dikeluarkan</li>
                                    <li>Jika <strong>Mula ≠ 0</strong> dan <strong>Akhir ≠ 0</strong>: Resit dikeluarkan dari nombor Mula hingga nombor Akhir sahaja</li>
                                    <li>Jika <strong>Mula = 0</strong> dan <strong>Akhir ≠ 0</strong>: Buku tidak digunakan, nombor Akhir adalah nombor resit pertama</li>
                                </ul>
                            </div>
                        </div>
                        <button type="button" class="btn btn-danger remove-kupon">Buang</button>
                    `;
                    
                    kuponItemsContainer.appendChild(newItem);
                    
                    // Tambah event listener untuk button buang yang baru ditambah
                    newItem.querySelector('.remove-kupon').addEventListener('click', function() {
                        this.closest('.kupon-item').remove();
                    });
                });
            });
            
            // Buang kupon
            document.addEventListener('click', function(e) {
                if (e.target && e.target.classList.contains('remove-kupon')) {
                    e.target.closest('.kupon-item').remove();
                }
            });
            
            // Padam amil
            const deleteBtn = document.getElementById('deleteBtn');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    if (confirm('Adakah anda pasti untuk memadam amil ini?')) {
                        const form = document.getElementById('amilForm');
                        const actionInput = document.querySelector('input[name="action"]');
                        actionInput.value = 'delete';
                        form.submit();
                    }
                });
            }
        });
    </script>
</body>
</html>
