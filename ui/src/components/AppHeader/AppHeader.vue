<template>
  <cv-header aria-label="Welcome">
    <cv-skip-to-content href="#main-content"
      >Skip to content</cv-skip-to-content
    >
    <cv-header-name to="/" prefix="SBW">Convert</cv-header-name>
    <template v-slot:header-global>
      <cv-header-global-action
        aria-label="Github"
        label="See this code on Github"
      >
        <cv-link
          href="https://github.com/davidnixon/sbw2csv"
          target="_blank"
          :inline="true"
        >
          <LogoGithub32 color="white" />
        </cv-link>
      </cv-header-global-action>
      ></template
    >
  </cv-header>
</template>

<script>
import { LogoGithub32 } from '@carbon/icons-vue/';
export default {
  name: 'AppHeader',
  components: { LogoGithub32 },
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
