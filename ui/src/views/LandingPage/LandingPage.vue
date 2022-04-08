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
          Years ago, your parents or grandparents may have purchased US Savings Bonds from
          <cv-link href="https://www.treasurydirect.gov/" target="_blank" :inline="true"
            >Treasury Direct</cv-link
          >
          , a website sponsored by the US Treasury Department. The site had a Savings Bond Wizard
          that let you track and identify the purchased bonds. But the SBW file is no longer
          supported and you may now have a file that’s unreadable – and you suspect the bonds are
          due or coming due.
        </div>
        <div class="explain">
          I’ve built a small program to convert that SBW file into an Excel file format, or any
          other spreadsheet. Just upload the file in the box, hit upload, and the file will
          automatically convert.
        </div>
        <div class="explain">
          Please know that the files will be deleted when the conversion is complete. You can view
          our privacy policy
          <cv-link :to="{name: 'privacy-page'}" :inline="true"> here. </cv-link>
        </div>
      </cv-column>
      <cv-column :sm="4" :md="8" :lg="6">
        <cv-inline-notification
          v-if="currentSize > maxSize"
          kind="error"
          :title="tooBig"
          :sub-title="invalidTotalSize"
        >
        </cv-inline-notification>
        <cv-file-uploader
          :label="label"
          :helperText="helperText"
          :drop-target-label="dropTargetLabel"
          :accept="accept"
          :clear-on-reselect="clearOnReselect"
          :initial-state-uploading="initialStateUploading"
          :multiple="multiple"
          :removable="removable"
          @change="actionChange"
          v-model="sbwFiles"
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
          <div>
            <Csv color="#73ca00" />
            <div class="sbw2csv__dl__label">
              {{ ready }}
            </div>
          </div>
          <cv-link :href="downloadLink" download>
            {{ download }}
            <Download16 />
          </cv-link>
        </div>
      </cv-column>
    </cv-row>
    <cv-row>
      <cv-column>
        <LogoGithub32 />
        <div class="sbw2csv__git">
          See the source code for this app in
          <cv-link href="https://github.com/davidnixon/sbw2csv" :inline="true" target="_blank">
            GitHub
          </cv-link>
        </div>
      </cv-column>
    </cv-row>
  </cv-grid>
</template>

<script>
import {Upload32, Csv20, Download16, LogoGithub32} from '@carbon/icons-vue';
import agent from 'superagent';
import {v4} from 'uuid';
import analytics from '@/api/analytics';

export default {
  name: 'LandingPage',
  components: {Csv: Csv20, Download16, LogoGithub32},
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
    downloadPrefix: '/download/',
    browserId: '',
    maxSize: 100 * 1024,
    currentSize: 0,
    invalidSize: 'Upload limit is 100K. This file is too big.',
    tooBig: 'Upload limit is 100K',
    invalidTotalSize: 'These files are too big. Remove some before uploading',
  }),
  created() {
    if (process.env.NODE_ENV !== 'production') this.downloadPrefix = '/services/';
    this.browserId = sessionStorage.getItem('browserId');
    if (!this.browserId) {
      this.browserId = v4();
      sessionStorage.setItem('browserId', this.browserId);
    }
    analytics.add(
      {
        name: 'page-visit',
        data: this.$route.name,
        browserId: this.browserId,
      },
      navigator,
    );
  },
  computed: {
    disabledUpload() {
      const ready = this.sbwFiles.find((item) => item.state == '');
      const tooBig = this.currentSize > this.maxSize;
      return tooBig || !ready;
    },
  },
  methods: {
    actionChange(val) {
      if (!val.length) return;
      analytics.add(
        {
          name: 'file-added',
          data: {size: val.slice(-1)[0].file.size},
          browserId: this.browserId,
        },
        navigator,
      );
      let done = this.sbwFiles.findIndex((item) => item.state != '');
      while (done > -1) {
        this.sbwFiles.splice(done, 1);
        done = this.sbwFiles.findIndex((item) => item.state != '');
      }
      this.currentSize = 0;
      this.sbwFiles.forEach((element) => {
        if (element.file.size > this.maxSize) {
          element.invalidMessage = this.invalidSize;
          element.state = 'error';
        } else this.currentSize += element.file.size;
      });
    },
    actionUpload() {
      analytics.add(
        {
          name: 'upload',
          data: {count: this.sbwFiles.length},
          browserId: this.browserId,
        },
        navigator,
      );

      this.downloadLink = '';

      const convert = agent.post('/services/convert');
      this.sbwFiles.forEach((element) => {
        if (element.state == '') {
          element.state = 'uploading';
          convert.attach('sbwFiles', element.file);
        }
      });

      convert
        .then((response) => {
          // console.log(response.body);
          this.downloadLink = `${this.downloadPrefix}${response.body.message}`;
          this.sbwFiles.forEach((element) => {
            element.state = 'complete';
          });
        })
        .catch((err) => {
          this.sbwFiles.forEach((element) => {
            element.state = 'error';
          });
          console.error(err);
        });
    },
  },
};
</script>

<style lang="scss">
@import '@/styles/theme';
@import 'carbon-components/scss/components/link/link';

@keyframes slideIn {
  from {
    transform: translateX(-100%) scale(4.5);
  }
  to {
    transform: translateX(0%) scale(1);
  }
}
.sbw2csv {
  &__dl {
    animation-name: slideIn;
    animation-duration: 0.75s;
    animation-fill-mode: forwards;
    &__label {
      @include carbon--type-style('label-01');
      display: inline-block;
      vertical-align: bottom;
      line-height: 24px;
      margin-left: 0.5rem;
    }
  }
  &__git {
    display: inline-block;
    height: 32px;
    vertical-align: text-bottom;
    padding-top: 4px;
    padding-left: 4px;
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
