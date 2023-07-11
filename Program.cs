using ArtFusion.Data;
using ArtFusion.Extensions;
using ArtFusion.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System;
using System.Text;

namespace ArtFusion
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters()
                {
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateLifetime = true,
                    ValidIssuer = "https://localhost:7194/",
                    ValidAudience = "https://localhost:7194/",
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration.GetSection("Jwt:Token").Value!))
                };
            });

            builder.Services.AddControllersWithViews();
            var connectionString = builder.Configuration.GetConnectionString("ConnectionString");
            var defaultConnection = builder.Configuration.GetConnectionString("DefaultConnection");
            var dbHost = Environment.GetEnvironmentVariable("DB_HOST");
            var dbName = Environment.GetEnvironmentVariable("DB_NAME");
            var dbPassword = Environment.GetEnvironmentVariable("DB_SA_PASSWORD");

            //var connectionString =$"Data Source={dbHost};Initial Catalog={dbName};User=SA;Password={dbPassword};TrustServerCertificate=true;MultipleActiveResultSets=true;";
            builder.Services.AddDbContext<ApplicationDbContext>(options =>
            {
                options.UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking);
                options.UseSqlServer(connectionString);
            });
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1",
                    new()
                    {
                        Title = "ArtFusion",
                        Version = "v1"
                    });
                /* ! Auth */
                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    In=ParameterLocation.Header,
                    Description="Please Insert Token",
                    Name="Authorization",
                    Type=SecuritySchemeType.Http
,                   BearerFormat="JWT",
                    Scheme="bearer"
                });
                c.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type=ReferenceType.SecurityScheme,
                                Id="Bearer"
                            }
                        },
                        new string[]{}
                    }
                });
            });
            builder.Services.AddTransient<IEmailService,EmailService>();
            

            var app = builder.Build();
            using (var serviceScope = app.Services.GetRequiredService<IServiceScopeFactory>().CreateScope())
            {
                var logger = serviceScope.ServiceProvider.GetRequiredService<ILogger<Program>>();
                var db = serviceScope.ServiceProvider.GetRequiredService<ApplicationDbContext>().Database;

                logger.LogInformation("Migrating database...");

                while (!db.CanConnect())
                {
                    logger.LogInformation("Database not ready yet; waiting...");
                    Thread.Sleep(1000);
                }

                try
                {
                    serviceScope.ServiceProvider.GetRequiredService<ApplicationDbContext>().Database.Migrate();
                    logger.LogInformation("Database migrated successfully.");
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "An error occurred while migrating the database.");
                }
            }
            app.UseSwagger();
            app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "v1"));

            // Configure the HTTP request pipeline.
            if (!app.Environment.IsDevelopment())
            {
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }
            // app.MigrationBuilder();
            
            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseAuthentication();
            app.UseRouting();
            app.UseAuthorization();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });

            app.MapControllerRoute(
                name: "default",
                pattern: "{controller}/{action=Index}/{id?}");

            app.MapFallbackToFile("index.html");
            app.Run();
        }
    }
}