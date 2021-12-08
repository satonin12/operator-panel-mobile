import * as Yup from 'yup'

const NameValidation = Yup.object().shape({
  name: Yup.string()
    .required('Имя обязательное поле')
    .min(2, 'В имени должно быть хотя бы 2 символа')
})

const TopicsValidation= Yup.object().shape({
  topics: Yup.string()
  .required('Обязательное поле')
  
})

const SubTopicsValidation= Yup.object().shape({
  subtopics: Yup.string()
  .required('Обязательное поле')
})

export const StartFormSchema = Yup.object()
  .shape({})
  .concat(NameValidation)
  .concat(TopicsValidation)
  .concat(SubTopicsValidation)
