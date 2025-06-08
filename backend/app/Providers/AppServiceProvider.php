<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register()
    {
        $this->app->bind(
            \App\Repositories\ProductRepositoryInterface::class,
            function ($app) {
                $em = app(\Doctrine\ORM\EntityManagerInterface::class);
                $repo = $em->getRepository(\App\Entities\Product::class);
                $repo->setEntityManager($em);
                return $repo;
            }
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
