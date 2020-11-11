import * as Yup from 'yup';

import * as AppConstant from '../constants';

const NameRegex = /^[a-zA-Z-]+$/;
const HypenRegex = /^(?=.*[a-zA-Z])[a-zA-Z-]+$/;
const NumberRegex = /^[0-9]+$/;
const AlphabetsAndNumbers = /^[a-zA-Z0-9_ ]+$/;
const Numbers = /^[0-9-]+$/;
const Alphabets = /^[a-zA-Z_ ]+$/;
const AllCharacters = /^[a-zA-Z0-9!@#$%^&*()+=,./[-{}`~;'":_ \n\t]+$/;
const URL = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const SignupSchema = Yup.object().shape({
  first_name: Yup.string()
    .trim()
    .min(2, AppConstant.Alert.FIRST_NAME_1)
    .required(AppConstant.Alert.FIRST_NAME_2)
    .matches(NameRegex, {
      excludeEmptyString: true,
      message: AppConstant.Alert.APLPHABETS_AND_HYPENS,
    })
    .matches(HypenRegex, {
      excludeEmptyString: true,
      message: AppConstant.Alert.HYPENS_ONLY,
    }),
  last_name: Yup.string()
    .trim()
    .min(2, AppConstant.Alert.LAST_NAME_1)
    .required(AppConstant.Alert.LAST_NAME_2)
    .matches(NameRegex, {
      excludeEmptyString: true,
      message: AppConstant.Alert.APLPHABETS_AND_HYPENS,
    })
    .matches(HypenRegex, {
      excludeEmptyString: true,
      message: AppConstant.Alert.HYPENS_ONLY,
    }),
  phone: Yup.string()
    .trim()
    .required(AppConstant.Alert.PHONE_1)
    .min(10, AppConstant.Alert.PHONE_2)
    .matches(NumberRegex, {
      excludeEmptyString: true,
      message: AppConstant.Alert.PHONE_2,
    }),
  dob: Yup.object().shape({
    day: Yup.number().required(AppConstant.Alert.DOB),
    month: Yup.string().required(),
    year: Yup.number().required(),
  }),
});

const EditProfileSchema = Yup.object().shape({
  first_name: Yup.string()
    .trim()
    .min(2, AppConstant.Alert.FIRST_NAME_1)
    .required(AppConstant.Alert.FIRST_NAME_2)
    .matches(NameRegex, {
      excludeEmptyString: true,
      message: AppConstant.Alert.APLPHABETS_AND_HYPENS,
    })
    .matches(HypenRegex, {
      excludeEmptyString: true,
      message: AppConstant.Alert.HYPENS_ONLY,
    }),
  last_name: Yup.string()
    .trim()
    .min(2, AppConstant.Alert.LAST_NAME_1)
    .required(AppConstant.Alert.LAST_NAME_2)
    .matches(NameRegex, {
      excludeEmptyString: true,
      message: AppConstant.Alert.APLPHABETS_AND_HYPENS,
    })
    .matches(HypenRegex, {
      excludeEmptyString: true,
      message: AppConstant.Alert.HYPENS_ONLY,
    }),
});

const PostFacebookSchema = Yup.object().shape({
  phone: Yup.string()
    .trim()
    .required(AppConstant.Alert.PHONE_1)
    .min(10, AppConstant.Alert.PHONE_2)
    .matches(NumberRegex, {
      excludeEmptyString: true,
      message: AppConstant.Alert.PHONE_2,
    }),
  dob: Yup.object().shape({
    day: Yup.number().required(AppConstant.Alert.DOB),
    month: Yup.string().required(),
    year: Yup.number().required(),
  }),
});

const LoginSchema = Yup.object().shape({
  phone: Yup.string()
    .trim()
    .required(AppConstant.Alert.PHONE_1)
    .min(10, AppConstant.Alert.PHONE_2)
    .matches(NumberRegex, {
      excludeEmptyString: true,
      message: AppConstant.Alert.PHONE_2,
    }),
});

const VerificationCodeSchema = Yup.object().shape({
  verificationCode: Yup.string()
    .trim()
    .required(AppConstant.Alert.SECURITY_CODE_1)
    .min(6, AppConstant.Alert.SECURITY_CODE_2)
    .matches(NumberRegex, {
      excludeEmptyString: true,
      message: AppConstant.Alert.SECURITY_CODE_2,
    }),
});

const EventSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .required(AppConstant.Alert.EVENT_NAME),
  occurrence_date: Yup.object().shape({
    day: Yup.number().required(AppConstant.Alert.EVENT_DATE),
    month: Yup.string().required(),
    year: Yup.number().required(),
  }),
});

const ProductInfo1 = Yup.object().shape({
  name: Yup.string()
    .trim()
    .required(`Name ${AppConstant.Alert.PRODUCT_INO_FIELD_ERROR1}`),
  brand: Yup.string()
    .trim()
    .required(`Brand ${AppConstant.Alert.PRODUCT_INO_FIELD_ERROR1}`),
  store: Yup.string()
    .trim()
    .required(`Store ${AppConstant.Alert.PRODUCT_INO_FIELD_ERROR1}`),
  price: Yup.number()
    .required(`Price ${AppConstant.Alert.PRODUCT_INO_FIELD_ERROR1}`)
    .moreThan(0.99, `${AppConstant.Alert.PRODUCT_INO_FIELD_ERROR3}`)
    .lessThan(999999),
});

const ProductInfo2 = Yup.object().shape({
  color_type: Yup.string().trim(),
  size_model: Yup.string().trim(),
  detail: Yup.string().trim(),
  feedback: Yup.string().trim(),
});

const ProductInfo3 = Yup.object().shape({
  sku: Yup.string().trim(),
  url: Yup.string()
    .trim()
    .lowercase()
    .matches(URL, AppConstant.Alert.PRODUCT_INO_FIELD_ERROR4),
});

const WebInputSchema = Yup.object().shape({
  searchKeyword: Yup.string()
    .trim()
    .required()
    .lowercase()
    .min(1),
});

const Address = Yup.object().shape({
  email: Yup.string()
    .trim()
    .nullable(true)
    .lowercase()
    .matches(emailRegex, 'Invalid email address'),
  is_mailing: Yup.boolean(),
  shipping_address: Yup.object().shape({
    line_1: Yup.string()
      .trim()
      .required(`Address ${AppConstant.Alert.PRODUCT_INO_FIELD_ERROR1}`),
    line_2: Yup.string().trim(),
    city: Yup.string()
      .trim()
      .required(`City/Town ${AppConstant.Alert.PRODUCT_INO_FIELD_ERROR1}`)
      .matches(
        Alphabets,
        `City/Town ${AppConstant.Alert.PRODUCT_INO_FIELD_ERROR6}`,
      ),
    state: Yup.string()
      .trim()
      .required(`State ${AppConstant.Alert.PRODUCT_INO_FIELD_ERROR1}`)
      .matches(Alphabets, `State ${AppConstant.Alert.PRODUCT_INO_FIELD_ERROR6}`),
    zip: Yup.string()
      .trim()
      .required(`Zip ${AppConstant.Alert.PRODUCT_INO_FIELD_ERROR1}`)
      .min(5, `Zip ${AppConstant.Alert.PRODUCT_INO_FIELD_ERROR5}`)
      .matches(Numbers, `Invalid zipcode`),
  }),
  mailing_address: Yup.object().when('is_mailing', {
    is: true,
    then: Yup.object().shape({
      line_1: Yup.string()
        .trim()
        .required(`Address ${AppConstant.Alert.PRODUCT_INO_FIELD_ERROR1}`),
      line_2: Yup.string().trim(),
      city: Yup.string()
        .trim()
        .required(`City/Town ${AppConstant.Alert.PRODUCT_INO_FIELD_ERROR1}`)
        .matches(
          Alphabets,
          `City/Town ${AppConstant.Alert.PRODUCT_INO_FIELD_ERROR6}`,
        ),
      state: Yup.string()
        .trim()
        .required(`State ${AppConstant.Alert.PRODUCT_INO_FIELD_ERROR1}`)
        .matches(
          Alphabets,
          `State ${AppConstant.Alert.PRODUCT_INO_FIELD_ERROR6}`,
        ),
      zip: Yup.string()
        .trim()
        .required(`Zip ${AppConstant.Alert.PRODUCT_INO_FIELD_ERROR1}`)
        .min(5, `Zip ${AppConstant.Alert.PRODUCT_INO_FIELD_ERROR5}`)
        .matches(Numbers, `Invalid zipcode`),
    }),
    otherwise: Yup.object(),
  }),
});

const WebFormSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .required(`Name ${AppConstant.Alert.PRODUCT_INO_FIELD_ERROR1}`),
});

const ContactUsForm = Yup.object().shape({
  email: Yup.string()
    .trim()
    .required()
    .lowercase()
    .matches(emailRegex, 'Invalid email address'),
  subject: Yup.string()
    .trim()
    .required(),
  emailBody: Yup.string()
    .trim()
    .required('Text is a required field'),
});

export default {
  SignupSchema,
  PostFacebookSchema,
  LoginSchema,
  VerificationCodeSchema,
  EventSchema,
  ProductInfo1,
  ProductInfo2,
  ProductInfo3,
  Address,
  EditProfileSchema,
  WebInputSchema,
  WebFormSchema,
  ContactUsForm,
};
