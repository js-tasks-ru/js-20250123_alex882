const toggleSidebarButton = document.querySelector('.sidebar__toggler');

const handleToggleSidebarButtonClick = () => {
  console.log('toggleSidebarButtonClick');
  document.body.classList.toggle('is-collapsed-sidebar');
};

toggleSidebarButton.addEventListener('click', handleToggleSidebarButtonClick);
