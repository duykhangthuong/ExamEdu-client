export const INTEGER = /^\d+$/;
export const ACCOUNT = /^[a-zA-Z0-9!@#$%^&*_-]{6,32}$/;
export const NAME = /^[ a-zA-Z0-9!@#$%^&*_-]{6,50}$/;
export const EMAIL =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const PHONE = /^((0)[3|5|7|8|9])+([0-9]{8,9})$/;
export const REQUIRED = "REQUIRED";
export const CONFIRM = "CONFIRM";
export const REGEX = "REGEX";
export const CALLBACK = "CALLBACK";
export const FULLNAME =
    /^[a-zA-Z ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂ ưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]{6,100}$/;

// API
export const API = process.env.REACT_APP_EXAM_EDU_API;
