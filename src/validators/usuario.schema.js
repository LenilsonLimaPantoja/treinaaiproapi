const yup = require('yup');
const dateTransform = (value, originalValue) => {
    if (!originalValue) return null;
    const date = new Date(originalValue);
    return isNaN(date.getTime()) ? null : date;
};

const id = yup
    .string()
    .uuid("O usuário é obrigatório e deve ser um UUID válido.")
    .required("O usuário é obrigatório.");

const nome = yup
    .string()
    .trim()
    .min(3, "O nome deve ter no mínimo 3 caracteres.")
    .typeError("O nome é obrigatório e deve ser um nome válido.")
    .required("O nome é obrigatório.");

const email = yup
    .string()
    .trim()
    .email("O email deve ser um email válido.")
    .typeError("O email é obrigatório e deve ser um email válido.")
    .required("O email é obrigatório.");

const senha = yup
    .string()
    .min(6, "A senha deve ter no mínimo 6 caracteres.")
    .typeError("A senha é obrigatória e deve ser uma senha válida.")
    .required("A senha é obrigatória.");

const nascimento = yup
    .date()
    .transform(dateTransform)
    .typeError("A data de nascimento é obrigatória e deve ser uma data válida.")
    .required("A data de nascimento é obrigatória.");

const filtro = yup
    .string()
    .nullable()
    .transform(v => (v === "" ? null : v))
    .optional();

const schemaCreateUsuario = yup.object({
    nome,
    email,
    senha,
    nascimento
});

const schemaUpdateMeUsuario = schemaCreateUsuario.concat(
    yup.object({
        id
    })
);

const schemaReadMeAndDeleteMeUsuario = yup.object({
    id
});

const schemaReadAllUsuario = yup.object({
    filtro
});

const schemaLoginUsuario = yup.object({
    email,
    senha
});

module.exports = {
    schemaCreateUsuario,
    schemaUpdateMeUsuario,
    schemaReadMeAndDeleteMeUsuario,
    schemaReadAllUsuario,
    schemaLoginUsuario
}