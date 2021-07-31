<template>
  <cv-grid>
    <cv-row>
      <cv-column :sm="4" :md="8" :lg="16">
        <h1>Savings Bond Wizard file converter</h1>
      </cv-column>
    </cv-row>
    <cv-row>
      <cv-column :sm="4" :md="8" :lg="6">
        <div class="explain">
          The Savings Bond Wizard used to be available
          <cv-link
            href="https://www.treasurydirect.gov/indiv/tools/tools_savingsbondwizard.htm"
            target="_blank"
            :inline="true"
          >
            here
          </cv-link>
          but is no longer available. If you have existing files with an SBW
          extension you can convert them here so that you can open them in Excel
          or any other spreadsheet.
        </div>
        <div class="explain">
          <p>
            What do we do with your files besides convert them? The short answer
            is <b>NOTHING</b>.
          </p>
          <p>The slightly longer answer is absolutely nothing.</p>
          <p>
            We do not keep them any longer than necessary to convert them for
            you. They are deleted when the conversion is done but may remain our
            servers for a while if there is an error during conversion but will
            never be stored longer than a few minutes.
          </p>
          <p>
            You can read our lenghty privacy policy
            <cv-link :to="{ name: 'privacy-page' }" :inline="true">
              here
            </cv-link>
          </p>
        </div>
      </cv-column>
      <cv-column :sm="4" :md="8" :lg="6">
        <cv-file-uploader
          :label="label"
          :helperText="helperText"
          :drop-target-label="dropTargetLabel"
          :accept="accept"
          :clear-on-reselect="clearOnReselect"
          :initial-state-uploading="initialStateUploading"
          :multiple="multiple"
          :removable="removable"
          ref="fileUploader"
        >
        </cv-file-uploader>
        <cv-button
          kind="primary"
          size=""
          :disabled="disabledUpload"
          @click="actionUpload"
          :icon="uploadIcon"
        >
          {{ btnUpload }}
        </cv-button>
      </cv-column>
    </cv-row>
  </cv-grid>
</template>

<script>
import { Upload32 } from '@carbon/icons-vue';
export default {
  name: 'LandingPage',
  components: {},
  data: () => ({
    label: 'Choose sbw files to upload',
    helperText: 'Select the Savings Bond Wizard files you want to upload',
    btnUpload: 'Upload',
    accept: '.sbw',
    clearOnReselect: false,
    initialStateUploading: false,
    multiple: false,
    removable: true,
    dropTargetLabel: '',
    uploadIcon: Upload32,
  }),
  computed: {
    disabledUpload() {
      return false;
    },
  },
  created() {},
  methods: {
    actionUpload() {
      console.log('upload');
    },
  },
};
</script>

<style lang="scss">
@import '@/styles/theme';
h1 {
  @include carbon--type-style('productive-heading-04');
  padding-top: $spacing-03;
  padding-bottom: $spacing-03;
}
.explain {
  @include carbon--type-style('body-long-01');
  padding-top: $spacing-03;
  padding-bottom: $spacing-03;

  p {
    @include carbon--type-style('body-long-01');
    padding-bottom: $spacing-02;
  }
}
</style>
