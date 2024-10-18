import * as yup from 'yup';

yup.setLocale({
  mixed: {
    required: '${path} é obrigatório',
  },
});

export default yup;
