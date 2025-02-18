<template>
    <div class="toast show" :class="'bg-' + type" role="alert">
      <div class="toast-body text-white">{{ message }}</div>
    </div>
  </template>
  
  <script>
  export default {
    props: ['message', 'type'],
  };
  </script>
  
  <style scoped>
  .toast {
    position: fixed;
    top: 10px;
    right: 10px;
    z-index: 1000;
  }
  </style>
  