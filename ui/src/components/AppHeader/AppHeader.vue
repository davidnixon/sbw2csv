<template>
  <cv-header aria-label="Welcome">
    <cv-skip-to-content href="#main-content"
      >Skip to content</cv-skip-to-content
    >
    <cv-header-name to="/" prefix="SBW">Convert</cv-header-name>
    <template v-slot:header-global> </template>
  </cv-header>
</template>

<script>
export default {
  name: 'AppHeader',
  components: {},
  data: () => ({
    sharedState: null,
  }),
  created() {
    this.sharedState = this.$root.$data.state;
  },
  methods: {},
};
</script>

<style lang="scss">
@import '@/styles/theme';
</style>
