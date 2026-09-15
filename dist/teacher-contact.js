// Set the owner's international WhatsApp number (digits only) to enable contact.
const TEACHER_WHATSAPP_NUMBER = '996550346970';
const teacherContact = document.querySelector('#teacher-contact');
if (/^[1-9]\d{6,14}$/.test(TEACHER_WHATSAPP_NUMBER)) {
 const message = "Hi! I'm using Oxford Classroom Games and would like to ask for help or suggest a game.";
 teacherContact.querySelector('a').href = 'https://wa.me/' + TEACHER_WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message);
 teacherContact.hidden = false;
}
