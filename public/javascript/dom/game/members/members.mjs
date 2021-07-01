import { memberTemplate } from './member.mjs';

const membersBlock = document.getElementById('members');

export function addMember(user, isYou) {
  membersBlock.appendChild(memberTemplate(user, isYou));
}

export function clearMembers() {
  membersBlock.innerHTML = '';
}
