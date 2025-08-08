const db = require('../db');

const findUserById = async (id) => {
    const query = 'SELECT * FROM usuarios WHERE id = ?'
    const values = [id]

    const result = await db.query(query, values)
    return result[0];
}

const findUserByEmail = async (email) => {
    const query = 'SELECT * FROM usuarios WHERE email = ?'
    const values = [email]

    const result = await db.query(query, values)
    return result[0];
}

const findUserByPhoneNumber = async (telefono) => {
    const query = 'SELECT * FROM usuarios WHERE telefono = ?'
    const values = [telefono]

    const result = await db.query(query, values)
    return result[0];
}

// Revisar parámetros para inicio de sesión
const findUserByEmailAndPassword = async (email, contrasena) => {
    const query = 'SELECT * FROM usuarios WHERE email = ? AND contrasena = ?'
    const values = [email, contrasena]

    const result = await db.query(query, values)
    return result[0]
}

const createUser = async (nombre, email, telefono, contrasena) => {
    const query = 'INSERT INTO usuarios (nombre, email, telefono, contrasena) VALUES (?, ?, ?, ?)';
    const values = [nombre, email, telefono, contrasena];

    const result = await db.query(query, values);
    return {
        id: result.insertId,
        nombre,
        email,
        telefono,
        contrasena
    };
}

const createGeneralUser = async(fecha_nacimiento, tipo_enfermedad, fecha_fin_tratamiento, usuario_id) => {
    const query = 'INSERT INTO usuarios_generales (fecha_nacimiento, tipo_enfermedad, fecha_fin_tratamiento, usuario_id) VALUES (?, ?, ?, ?)'
    const values = [fecha_nacimiento, tipo_enfermedad, fecha_fin_tratamiento, usuario_id]

    const result = await db.query(query, values)
    return{
        id: result.insertId,
        fecha_nacimiento,
        tipo_enfermedad,
        fecha_fin_tratamiento,
        usuario_id
    }
}

const updateUserPassword = async (id, contrasena) => {
    const query = 'UPDATE users SET contrasena = ? WHERE id = ?';
    const values = [contrasena, id];

    const result = await db.query(query, values);
    return result[0]
};

const findGeneralUser = async (usuario_id) => {
    const query = 'SELECT * FROM usuarios_generales WHERE usuario_id = ?'
    const values = [usuario_id]

    const result = await db.query(query, values)
    return result[0];
};

const findAllPhoneNumbers = async () => {
    const query = 'SELECT telefono FROM usuarios'
    const result = await db.query(query)
    return result[0]
}

const findAllEmailAddresses = async () => {
    const query = 'SELECT email FROM usuarios'
    const result = await db.query(query)
    return result[0]
}

const updateUserEmail = async (email, id) => {
    const query = 'UPDATE usuarios SET email = ? WHERE id = ?'
    const values = [email, id]

    const result = await db.query(query, values)
    return result[0]
}

const updateUserPhone = async (telefono, id) => {
    const query = 'UPDATE usuarios SET telefono = ? WHERE id = ?'
    const values = [telefono, id]

    const result = await db.query(query, values)
    return result[0]
}

module.exports = {
    createUser,
    createGeneralUser,
    updateUserPassword,
    findUserById,
    findUserByEmail,
    findUserByPhoneNumber,
    findUserByEmailAndPassword,
    findGeneralUser,
    findAllPhoneNumbers,
    findAllEmailAddresses,
    updateUserEmail,
    updateUserPhone
}
