<?php
/**
 * Created by PhpStorm.
 * User: Emanuel
 * Date: 03.10.2019
 * Time: 19:01
 */

namespace App\Service;

use App\Entity\Rooms;
use App\Entity\User;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Contracts\Translation\TranslatorInterface;
use Twig\Environment;


class UserService
{
    private $mailer;
    private $parameterBag;
    private $twig;
    private $notificationService;
    private $url;
    private $translator;

    public function __construct(TranslatorInterface $translator, MailerService $mailerService, ParameterBagInterface $parameterBag, Environment $environment, NotificationService $notificationService, UrlGeneratorInterface $urlGenerator)
    {
        $this->mailer = $mailerService;
        $this->parameterBag = $parameterBag;
        $this->twig = $environment;
        $this->notificationService = $notificationService;
        $this->url = $urlGenerator;
        $this->translator = $translator;
    }

    function generateUrl(Rooms $room, User $user)
    {

        $data = base64_encode('uid=' . $room->getUid() . '&email=' . $user->getEmail());
        $url = $this->parameterBag->get('laF_baseUrl').$this->url->generate('join_index', ['data' => $data, 'slug' => $room->getServer()->getSlug()]);
        return $url;
    }

    function addUser(User $user, Rooms $room)
    {
        $url = $this->generateUrl($room, $user);
        $content = $this->twig->render('email/addUser.html.twig', ['user' => $user, 'room' => $room, 'url' => $url]);
        $subject = $this->translator->trans('Neue Einladung zu einer Videokonferenz');
        $ics = $this->notificationService->createIcs($room, $user, $url, 'REQUEST');
        $attachement[] = array('type' => 'text/calendar', 'filename' => $room->getName() . '.ics', 'body' => $ics);
        $this->notificationService->sendNotification($content, $subject, $user, $room->getServer(), $attachement);

        return true;
    }

    function editRoom(User $user, Rooms $room)
    {

        $url = $this->generateUrl($room, $user);
        $content = $this->twig->render('email/editRoom.html.twig', ['user' => $user, 'room' => $room, 'url' => $url]);
        $subject = $this->translator->trans('Videokonferenz wurde bearbeitet');
        $ics = $this->notificationService->createIcs($room, $user, $url, 'REQUEST');
        $attachement[] = array('type' => 'text/calendar', 'filename' => $room->getName() . '.ics', 'body' => $ics);
        $this->notificationService->sendNotification($content, $subject, $user, $room->getServer(), $attachement);

        return true;
    }

    function removeRoom(User $user, Rooms $room)
    {
        $url = $this->generateUrl($room, $user);
        $content = $this->twig->render('email/removeRoom.html.twig', ['user' => $user, 'room' => $room,]);
        $subject = $this->translator->trans('Videokonferenz abgesagt');
        $ics = $this->notificationService->createIcs($room, $user, $url, 'CANCEL');
        $attachement[] = array('type' => 'text/calendar', 'filename' => $room->getName() . '.ics', 'body' => $ics);
        $this->notificationService->sendNotification($content, $subject, $user, $room->getServer(), $attachement);

        return true;
    }

    function notifyUser(User $user, Rooms $room)
    {
        $url = $this->generateUrl($room, $user);
        $content = $this->twig->render('email/rememberUser.html.twig', ['user' => $user, 'room' => $room, 'url' => $url]);
        $subject = $this->translator->trans('Videokonferenz {room} startet gleich', array('{room}' => $room->getName()));
        $this->notificationService->sendCron($content, $subject, $user, $room->getServer());

        return true;
    }


}
