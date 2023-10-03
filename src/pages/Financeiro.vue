<template>
    <el-row :gutter="16">
		<el-col :span="8">
			<div class="statistic-card">
				<el-statistic :value="500">
					<template #title>
						<div style="display: inline-flex; align-items: center">Pedidos Delivery</div>
					</template>
				</el-statistic>
			</div>
		</el-col>

		<el-col :span="8">
			<div class="statistic-card">
				<el-statistic :value="250">
					<template #title>
						<div style="display: inline-flex; align-items: center">Pedidos Praça/Retirada</div>
					</template>
				</el-statistic>
			</div>
		</el-col>

		<el-col :span="8">
			<div class="statistic-card">
				<el-statistic :value="9500">
					<template #title>
						<div style="display: inline-flex; align-items: center">Total vendido R$</div>
					</template>
				</el-statistic>
			</div>
		</el-col>
  	</el-row>
</template>

<style lang="scss">
	:global(h2#card-usage ~ .example .example-showcase) {
		background-color: var(--el-fill-color) !important;
	}

	.el-statistic {
		--el-statistic-content-font-size: 28px;
	}

	.statistic-card {
		height: 100%;
		padding: 20px;
		border-radius: 4px;
		background-color: var(--el-bg-color-overlay);
	}

	.statistic-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		font-size: 12px;
		color: var(--el-text-color-regular);
		margin-top: 16px;
	}

	.statistic-footer .footer-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.statistic-footer .footer-item span:last-child {
		display: inline-flex;
		align-items: center;
		margin-left: 4px;
	}

	.green {
		color: var(--el-color-success);
	}
	.red {
		color: var(--el-color-error);
	}
</style>