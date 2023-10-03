<template>
    <div id="layout-auth">
      <el-row>
        <el-col :span="14">
          <div id="layout-auth__banner"></div>
        </el-col>
  
        <el-col :span="10">
          <div id="layout-auth__view">
            <slot />
          </div>
        </el-col>
      </el-row>
    </div>
  </template>

<style lang="scss" scoped>
  #layout-auth {
    &__banner {
      background: url('../assets/images/banner.jpg') no-repeat center;
      background-size: cover;
      height: 100vh;
      width: 100%;
    }
    &__view {
      align-items: center;
      display: flex;
      height: 100%;
      padding: 0 50px;
    }
  }
</style>
