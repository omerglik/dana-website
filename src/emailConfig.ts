import emailjs from '@emailjs/browser';

// הגדרות EmailJS - פרטים אמיתיים של דנה
export const EMAIL_CONFIG = {
  SERVICE_ID: 'service_2c3pjjj',
  TEMPLATE_ID: 'template_jd1vhzg',  
  PUBLIC_KEY: 'Tp5h8IfR07ljsxqVd'
};

// אתחול EmailJS
emailjs.init(EMAIL_CONFIG.PUBLIC_KEY);

export default emailjs; 