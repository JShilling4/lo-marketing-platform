<template>
  <div class="addResources">
    <h1 class="heading">Add Resources</h1>
    <div class="resourceCard-container">
      <resource-card
        v-for="resource in resources.resources"
        :key="resource.id"
        :resource="resource"
      />

      <div class="card-filler"></div>
      <div class="card-filler"></div>
      <div class="card-filler"></div>
      <div class="card-filler"></div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
// components
import ResourceCard from '@/components/Shared/ResourceCard';

export default {
  name: 'add-resources',
  components: {
    'resource-card': ResourceCard,
  },
  computed: {
    ...mapState(['resources']),
  },
};
</script>

<style lang="scss" scoped>
.addResources {
  padding: $standard-view;
}
.resourceCard-container {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-top: 6rem;
}
.card-filler {
  width: 17%;
}
</style>
