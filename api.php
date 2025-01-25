
<?php

require 'conexaodb.php';

// Rota para consultar todos os corretores
if ($_SERVER['REQUEST_METHOD'] === 'GET' && empty($_GET)) {
    try {
        $stmt = $conn->query('SELECT * FROM usuario');
        $usuarios = $stmt->fetchAll(PDO::FETCH_ASSOC);
        header('Content-Type: application/json');
        echo json_encode($usuarios);
    } catch (PDOException $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
}

// Rota para adicionar um novo corretor
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (empty($data['nome'])) {
        echo json_encode(['error' => 'O nome do corretor é obrigatório']);
        exit;
    }

    $nome = $data['nome'];
    $cpf = $data['cpf'] ?? null;
    $creci = $data['creci'] ?? null;

    try {
        $stmt = $conn->prepare('INSERT INTO usuario (nome, cpf, creci) VALUES (:nome, :cpf, :creci)');
        $stmt->bindParam(':nome', $nome);
        $stmt->bindParam(':cpf', $cpf);
        $stmt->bindParam(':creci', $creci);
        $stmt->execute();
        $usuarioId = $conn->lastInsertId();
        echo json_encode(['id' => $usuarioId, 'nome' => $nome, 'cpf' => $cpf, 'creci' => $creci]);
    } catch (PDOException $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
}

// Rota para atualizar as informações de um corretor
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (empty($data['id'])) {
        echo json_encode(['error' => 'O ID do corretor é obrigatório']);
        exit;
    }

    $usuarioId = $data['id'];
    $nome = $data['nome'] ?? null;
    $cpf = $data['cpf'] ?? null;
    $creci = $data['creci'] ?? null;

    try {
        $stmt = $conn->prepare('UPDATE usuario SET nome = :nome, cpf = :cpf, creci = :creci WHERE id = :id');
        $stmt->bindParam(':nome', $nome);
        $stmt->bindParam(':cpf', $cpf);
        $stmt->bindParam(':creci', $creci);
        $stmt->bindParam(':id', $usuarioId);
        $stmt->execute();
        echo json_encode(['success' => true]);
    } catch (PDOException $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
}

// Rota para deletar um corretor
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (empty($data['id'])) {
        echo json_encode(['error' => 'O ID do corretor é obrigatório']);
        exit;
    }

    $usuarioId = $data['id'];

    try {
        $stmt = $conn->prepare('DELETE FROM usuario WHERE id = :id');
        $stmt->bindParam(':id', $usuarioId);
        $stmt->execute();
        echo json_encode(['success' => true]);
    } catch (PDOException $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
}
?> 