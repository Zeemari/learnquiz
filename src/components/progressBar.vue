<template>
    <div class="progress">
      <div class="progress-bar" role="progressbar" :style="{ width: progress + '%' }"></div>
    </div>
  </template>
  
  <script>
  export default {
    props: ['progress'],
  };
  </script>
  