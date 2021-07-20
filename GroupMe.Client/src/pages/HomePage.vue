<template>
  <div>
    <div class="card m-4 shadow" v-for="g in groups" :key="g.id">
      <div class="card-body">
        <h3>
          {{ g.name }}
        </h3>
        <p>{{ g.description }}</p>
        <div>
          <button v-if="g.creator.id !== account.id" @click="joinGroup(g)">
            Join Group
          </button>
        </div>
      </div>
      <div class="card-footer text-right">
        <b>{{ g.creator.name }}</b>
        <img :src="g.creator.picture" alt="group creator image" class="rounded-circle elevation-1 mx-2" height="40">
      </div>
    </div>
    {{ user }}
    {{ identity }}
    <button @click="test">
      get Token
    </button>
  </div>
</template>

<script>
import { computed, onMounted, reactive } from 'vue'
import { AppState } from '../AppState'
import { groupsService } from '../services/GroupsService'
import { AuthService } from '../services/AuthService'

export default {
  name: 'Home',
  setup() {
    onMounted(() => {
      groupsService.getGroups()
    })

    return reactive({
      account: computed(() => AppState.account),
      user: computed(() => AppState.user),
      identity: computed(() => AppState.identity),
      groups: computed(() => AppState.groups),
      joinGroup(g) {
        groupsService.joinGroup(g)
      },
      test() {
        AuthService.getTokenWithPopup()
      }
    })
  }
}
</script>

<style scoped lang="scss">
.home{
  text-align: center;
  user-select: none;
  > img{
    height: 200px;
    width: 200px;
  }
}
</style>
