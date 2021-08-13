<template>
  <cv-grid>
    <cv-row>
      <cv-column :sm="4" :md="8" :lg="16">
        <h1>Convert Your Savings Bond Wizard File to Excel</h1>
      </cv-column>
    </cv-row>
    <cv-row>
      <cv-column :sm="4" :md="8" :lg="6">
        <div class="explain">
          Years ago, your parents or grandparents may have purchased US Savings
          Bonds from
          <cv-link
            href="https://www.treasurydirect.gov/"
            target="_blank"
            :inline="true"
            >Treasury Direct</cv-link
          >
          , a website sponsored by the US Treasury Department. The site had a
          Savings Bond Wizard that let you track and identify the purchased
          bonds. But the SBW file is no longer supported and you may now have a
          file that’s unreadable – and you suspect the bonds are due or coming
          due.
        </div>
        <div class="explain">
          I’ve built a small program to convert that SBW file into an Excel file
          format, or any other spreadsheet. Just upload the file in the box, hit
          upload, and the file will automatically convert.
        </div>
        <div class="explain">
          Please know that the files will be deleted when the conversion is
          complete. You can view our privacy policy
          <cv-link :to="{ name: 'privacy-page' }" :inline="true">
            here.
          </cv-link>
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
          v-model="sbwFiles"
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
    <cv-row>
      <cv-column :sm="4" :md="8" :lg="6">
        <div v-if="downloadLink" class="sbw2csv__dl">
          <Csv color="#73ca00" />
          <div class="sbw2csv__dl__label">
            {{ ready }}
          </div>
        </div>
        <cv-link v-if="downloadLink" :href="downloadLink" download>
          {{ download }}
          <Download16 />
        </cv-link>
      </cv-column>
    </cv-row>
  </cv-grid>
</template>

<script>
import { Upload32, Csv20, Download16 } from '@carbon/icons-vue';
import agent from 'superagent';

export default {
  name: 'LandingPage',
  components: { Csv: Csv20, Download16 },
  data: () => ({
    label: 'Choose sbw files to upload',
    helperText: 'Select the Savings Bond Wizard files you want to upload',
    btnUpload: 'Upload',
    ready: 'Your file is ready. Click the download link.',
    download: 'Download',
    accept: '.sbw',
    clearOnReselect: false,
    initialStateUploading: false,
    multiple: false,
    removable: true,
    dropTargetLabel: '',
    uploadIcon: Upload32,
    sbwFiles: [],
    downloadLink: '',
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
      this.sbwFiles.forEach((element) => {
        console.log('element', element);
      });

      var convert = agent.post('/services/convert');
      this.sbwFiles.forEach((element) => {
        convert.attach('sbwFiles', element.file);
      });

      convert
        .then((response) => {
          console.log(response.body);
          this.downloadLink = '/services/' + response.body.message;
        })
        .catch((err) => {
          console.error(err);
        });
    },
  },
};
</script>

<style lang="scss">
@import '@/styles/theme';
.sbw2csv {
  &__dl {
    &__label {
      @include carbon--type-style('label-01');
      display: inline-block;
      vertical-align: bottom;
      line-height: 24px;
      margin-left: 0.5rem;
    }
  }
}

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
