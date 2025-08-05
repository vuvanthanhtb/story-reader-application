import { TEXT, PASSWORD, BUTTON } from "shared/constants";
import { IForm } from "shared/models";

export const loginConfig: IForm = {
  fields: [
    {
      type: TEXT,
      name: "username",
      label: "Tài khoản",
      required: true,
      size: 12,
      validation: {
        required: {
          value: true,
          message: "Vui lòng nhập tài khoản",
        },
      },
    },
    {
      type: PASSWORD,
      name: "password",
      label: "Mật khẩu",
      required: true,
      size: 12,
      validation: {
        required: {
          value: true,
          message: "Vui lòng nhập mật khẩu",
        },
      },
    },
    {
      type: BUTTON,
      size: 12,
      childs: [
        {
          label: "Đăng nhập",
          type: "submit",
          action: "submit",
        },
      ],
    },
  ],
};

export const initialValues = {
  username: "emilys",
  password: "emilyspass",
};
